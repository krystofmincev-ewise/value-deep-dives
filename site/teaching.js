(function () {
  "use strict";

  const STEP_DURATION_MS = 6000;
  const TOKEN_DURATION_MS = 2800;

  /** @typedef {{step: number|null, playing: boolean}} PlayerState */
  /** @typedef {"next"|"previous"|"play"|"pause"|"reset"|"tick"} PlayerAction */
  /** @typedef {{x: number, y: number}} Point */
  /** @typedef {{points: Point[], distances: number[], length: number}} Route */
  /** @typedef {{pause: () => void, figure: HTMLElement}} PlayerHandle */

  /** Pure state transitions; null means the complete static picture. */
  /** @param {PlayerState} state @param {PlayerAction} action @param {number} count */
  function transition(state, action, count) {
    if (!Number.isInteger(count) || count < 1) throw new RangeError("No reading stages");
    if (
      typeof state.playing !== "boolean" ||
      (state.step !== null && (!Number.isInteger(state.step) || state.step < 0 || state.step >= count)) ||
      (state.playing && state.step === null)
    ) {
      throw new RangeError("Invalid player state");
    }
    switch (action) {
      case "reset": return { step: null, playing: false };
      case "pause": return { step: state.step, playing: false };
      case "next": return { step: state.step === null ? 0 : Math.min(state.step + 1, count - 1), playing: false };
      case "previous": return { step: state.step === null ? null : Math.max(0, state.step - 1), playing: false };
      case "play": return { step: state.step === null || state.step === count - 1 ? 0 : state.step, playing: true };
      case "tick":
        if (!state.playing) return state;
        if (state.step === count - 1) return { step: state.step, playing: false };
        return { step: /** @type {number} */ (state.step) + 1, playing: true };
      default: throw new RangeError("Unknown player action");
    }
  }

  /** @param {string|null} value @returns {Point|null} */
  function parsePoint(value) {
    if (typeof value !== "string") return null;
    const parts = value.split(",");
    if (parts.length !== 2 || parts.some((part) => part.trim() === "")) return null;
    const [x, y] = parts.map(Number);
    return Number.isFinite(x) && Number.isFinite(y) ? { x, y } : null;
  }

  /** Read only the route declared by the SVG; invalid routes remain still. */
  /** @param {string|null} from @param {string|null} via @param {string|null} to @returns {Route|null} */
  function buildRoute(from, via, to) {
    const raw = [from, ...(via ? via.split(";") : []), to].map(parsePoint);
    if (raw.some((point) => point === null)) return null;
    /** @type {Point[]} */
    const points = [];
    /** @type {number[]} */
    const distances = [];
    let length = 0;
    for (const point of raw) {
      if (!point) return null;
      const previous = points[points.length - 1];
      const distance = previous ? Math.hypot(point.x - previous.x, point.y - previous.y) : 0;
      if (previous && distance === 0) continue;
      length += distance;
      points.push(point);
      distances.push(length);
    }
    if (points.length < 2 || !Number.isFinite(length) || length === 0) return null;
    return { points, distances, length };
  }

  /** Distance-proportional offsets keep speed constant around the declared corners. */
  /** @param {Route} route @returns {Keyframe[]} */
  function routeKeyframes(route) {
    return route.points.map((point, index) => ({
      transform: `translate(${point.x}px, ${point.y}px)`,
      opacity: 1,
      offset: route.distances[index] / route.length,
    }));
  }

  /** @param {{top:number, bottom:number, left:number, right:number}} rect @param {number} width @param {number} height */
  function overlapsViewport(rect, width, height) {
    return rect.bottom > 0 && rect.right > 0 && rect.top < height && rect.left < width;
  }

  /** Coordinate playback without resetting the other reader's focused stage. */
  function createCoordinator() {
    /** @type {PlayerHandle|null} */
    let active = null;
    return {
      /** @param {PlayerHandle} player */
      activate(player) {
        if (active && active !== player) active.pause();
        active = player;
      },
      /** @param {PlayerHandle} player */
      release(player) { if (active === player) active = null; },
      pauseActive() { if (active) active.pause(); },
      getActive() { return active; },
    };
  }

  /** @param {HTMLElement} figure @param {ReturnType<typeof createCoordinator>} coordinator @param {MediaQueryList} motion */
  function createPlayer(figure, coordinator, motion) {
    const controls = figure.querySelector(".motion-controls");
    const svg = figure.querySelector("svg");
    const status = figure.querySelector(".step-status");
    const explanation = figure.querySelector(".motion-explanation");
    const buttons = Object.fromEntries(
      Array.from(figure.querySelectorAll("button[data-action]")).map((button) => [button.getAttribute("data-action"), button]),
    );
    const stages = Array.from(figure.querySelectorAll(".teaching-stage"));
    if (!(controls instanceof HTMLElement) || !svg || !status || !explanation) return null;
    if (!["previous", "next", "play", "reset"].every((key) => buttons[key] instanceof HTMLButtonElement)) return null;

    let steps;
    try { steps = JSON.parse(controls.dataset.steps || "null"); } catch { return null; }
    if (
      !Array.isArray(steps) || steps.length === 0 || steps.length !== stages.length ||
      !steps.every((step) => step && typeof step.title === "string" && typeof step.text === "string") ||
      !stages.every((stage, index) => stage.getAttribute("data-step") === String(index + 1))
    ) return null;

    /** @type {PlayerState} */
    let state = { step: null, playing: false };
    /** @type {number|null} */
    let timer = null;
    /** @type {Set<Animation>} */
    const animations = new Set();
    const tokens = Array.from(svg.querySelectorAll(".travel-token"));
    tokens.forEach((token) => token.setAttribute("aria-hidden", "true"));
    if (!svg.id) svg.id = `${figure.id}-diagram`;
    Object.values(buttons).forEach((button) => button.setAttribute("aria-controls", svg.id));

    function onScreen() {
      return overlapsViewport(figure.getBoundingClientRect(), window.innerWidth, window.innerHeight);
    }

    function cancelMotion() {
      for (const animation of animations) animation.cancel();
      animations.clear();
    }

    function clearTimer() {
      if (timer !== null) window.clearTimeout(timer);
      timer = null;
    }

    function animateCurrentStage() {
      if (motion.matches || state.step === null) return;
      for (const token of tokens) {
        if (token.getAttribute("data-step") !== String(state.step + 1) || typeof token.animate !== "function") continue;
        const route = buildRoute(token.getAttribute("data-from"), token.getAttribute("data-via"), token.getAttribute("data-to"));
        if (!route) continue;
        const animation = token.animate(routeKeyframes(route), {
          duration: TOKEN_DURATION_MS,
          easing: "linear",
          iterations: 1,
          fill: "none",
        });
        animations.add(animation);
        // No fill forwards: the SVG's opacity:0 returns when the marker arrives.
        animation.onfinish = () => { animations.delete(animation); animation.cancel(); };
        animation.oncancel = () => animations.delete(animation);
      }
    }

    function render() {
      stages.forEach((stage, index) => {
        stage.classList.toggle("is-muted", state.step !== null && state.step !== index);
        stage.classList.toggle("is-current", state.step === index);
      });
      figure.dataset.currentStep = state.step === null ? "all" : String(state.step + 1);
      figure.dataset.playing = String(state.playing);
      buttons.previous.disabled = state.step === null || state.step === 0;
      buttons.next.disabled = state.step === steps.length - 1;
      buttons.reset.disabled = state.step === null;
      buttons.play.textContent = state.playing ? "Pause" : state.step === steps.length - 1 ? "Play again" : "Play steps";
      buttons.play.setAttribute("aria-pressed", String(state.playing));
      if (state.step === null) {
        status.textContent = `All ${steps.length} stages shown`;
        explanation.textContent = "Choose Next step to focus one stage, or Play steps to follow them in order. The rest of the picture stays visible.";
      } else {
        const step = steps[state.step];
        status.textContent = `Step ${state.step + 1} of ${steps.length}: ${step.title}${state.playing ? " · Playing" : ""}`;
        explanation.textContent = step.text;
      }
    }

    /** @param {PlayerAction} action */
    function dispatch(action) {
      const previous = state;
      const next = transition(state, action, steps.length);
      if (next.playing && !previous.playing) {
        if (document.hidden || !onScreen()) return;
        coordinator.activate(player);
      }
      clearTimer();
      cancelMotion();
      state = next;
      if (!state.playing) coordinator.release(player);
      render();
      if (state.playing) {
        if (!previous.playing || previous.step !== state.step) animateCurrentStage();
        timer = window.setTimeout(() => dispatch("tick"), STEP_DURATION_MS);
      }
    }

    /** @type {PlayerHandle} */
    const player = { figure, pause: () => dispatch("pause") };
    buttons.previous.addEventListener("click", () => dispatch("previous"));
    buttons.next.addEventListener("click", () => dispatch("next"));
    buttons.reset.addEventListener("click", () => dispatch("reset"));
    buttons.play.addEventListener("click", () => dispatch(state.playing ? "pause" : "play"));
    const motionChanged = () => { if (motion.matches) cancelMotion(); };
    if (typeof motion.addEventListener === "function") motion.addEventListener("change", motionChanged);
    else if (typeof motion.addListener === "function") motion.addListener(motionChanged);
    render();
    controls.hidden = false;
    return player;
  }

  function initialize() {
    const coordinator = createCoordinator();
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const players = Array.from(document.querySelectorAll(".teaching-figure"))
      .filter((figure) => figure instanceof HTMLElement)
      .map((figure) => createPlayer(figure, coordinator, motion))
      .filter((player) => player !== null);
    document.addEventListener("visibilitychange", () => { if (document.hidden) coordinator.pauseActive(); });
    window.addEventListener("pagehide", () => coordinator.pauseActive());
    if (typeof window.IntersectionObserver === "function") {
      const observer = new IntersectionObserver((entries) => {
        const active = coordinator.getActive();
        if (active && entries.some((entry) => entry.target === active.figure && (!entry.isIntersecting || entry.intersectionRatio === 0))) {
          active.pause();
        }
      }, { threshold: 0 });
      players.forEach((player) => observer.observe(player.figure));
    } else {
      const pauseOffscreen = () => {
        const active = coordinator.getActive();
        if (active && !overlapsViewport(active.figure.getBoundingClientRect(), window.innerWidth, window.innerHeight)) active.pause();
      };
      window.addEventListener("scroll", pauseOffscreen, { passive: true, capture: true });
      window.addEventListener("resize", pauseOffscreen, { passive: true });
    }
  }

  // Node tests exercise pure logic without a DOM or any installed dependencies.
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { STEP_DURATION_MS, transition, parsePoint, buildRoute, routeKeyframes, overlapsViewport, createCoordinator };
  }
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
    else initialize();
  }
})();
