'use strict';

// Presentation only. Economic results and adoption forecasts are saved by Python.
(() => {
  const data = JSON.parse(document.getElementById('adoption-data').textContent);
  const numberFormatter = new Intl.NumberFormat('en-GB', {
    maximumFractionDigits: 2,
  });
  const svgNamespace = 'http://www.w3.org/2000/svg';
  const playbackIntervalMs = 1100;
  let playback = null;

  function element(id) {
    return document.getElementById(id);
  }

  function number(value) {
    return value == null ? 'Not saved' : numberFormatter.format(Number(value));
  }

  function percent(value) {
    return value == null ? 'Not saved' : `${number(100 * value)}%`;
  }

  function write(id, value) {
    element(id).textContent = value;
  }

  function createElement(tag, text, className) {
    const node = document.createElement(tag);
    if (text != null) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function definitionList(entries) {
    const list = document.createElement('dl');
    entries.forEach(([label, value]) => {
      list.append(createElement('dt', label), createElement('dd', value));
    });
    return list;
  }

  function tableRow(values) {
    const row = document.createElement('tr');
    values.forEach(value => row.append(createElement('td', value)));
    return row;
  }

  function shopName(firmId, index) {
    if (firmId === 'consumer_a') return 'Shop A';
    if (firmId === 'consumer_b') return 'Shop B';
    return `Shop ${index + 1}`;
  }

  function selection() {
    const record = data[element('adoption-case').value];
    const index = Number(element('adoption-round').value);
    return { record, index, row: record.periods[index] };
  }

  function renderMetrics(row) {
    const metrics = [
      ['worker-baskets', row.worker_real_consumption],
      ['all-baskets', row.real_consumption],
      ['real-gdp', row.real_gdp],
      ['nominal-gdp', row.nominal_gdp],
      ['ai-revenue', row.ai_provider_revenue],
      ['equipment', row.investment],
      ['unspent', row.unspent_consumption_budget],
    ];
    metrics.forEach(([id, value]) => write(id, number(value)));
  }

  function firmCard(firm, index) {
    const card = createElement('div', null, 'firm-card');
    card.append(createElement('h3', shopName(firm.firm_id, index)));
    card.append(definitionList([
      ['Tasks automated', percent(firm.automation_fraction)],
      ['Price per basket', number(firm.price)],
      ['Baskets sold', number(firm.quantity)],
      ['People on payroll', number(firm.headcount)],
      ['Contracted shifts', number(firm.contracted_hours)],
      ['Shifts used for orders', number(firm.actual_hours)],
      ['Base wages paid', number(firm.wages_paid)],
      ['AI bill', number(firm.ai_fees)],
      ['Gross operating surplus', number(firm.gross_surplus)],
    ]));
    return card;
  }

  function renderFirms(row) {
    element('firm-cards').replaceChildren(...row.firms.map(firmCard));
  }

  function decisionReason(reason) {
    const descriptions = {
      predicted_surplus_improves: 'Adopt: predicted operating surplus is higher.',
      predicted_surplus_not_higher: 'Keep the current stage: the candidate does not clear the gain required by the rule.',
      no_new_available_stage: 'Keep the current stage: no new adoption step is available.',
      scheduled_stage: 'The saved schedule sets the automation stage.',
    };
    return descriptions[reason] ?? String(reason ?? 'Not saved').replaceAll('_', ' ');
  }

  function adoptionDecisionCard(decision, index) {
    const card = createElement('div', null, 'decision-card');
    card.append(createElement('h4', shopName(decision.firm_id, index)));

    if (decision.rule !== 'bounded_myopic') {
      const label = decision.rule === 'scheduled'
        ? 'Scheduled adoption; this is not a profit-based choice.'
        : `Saved adoption rule: ${String(decision.rule).replaceAll('_', ' ')}.`;
      card.append(createElement('p', label, 'decision-label'));
      card.append(definitionList([
        ['Available stage', percent(decision.available_automation)],
        ['Chosen stage', percent(decision.chosen_automation)],
      ]));
      return card;
    }

    card.append(createElement('p', 'One-step prediction before choosing', 'decision-label'));
    card.append(definitionList([
      ['Available stage', percent(decision.available_automation)],
      ['Stage before the choice', percent(decision.previous_automation)],
      ['Candidate stage', percent(decision.candidate_automation)],
      ['Chosen stage', percent(decision.chosen_automation)],
      ['Predicted surplus: current stage', number(decision.predicted_current_surplus)],
      ['Predicted surplus: candidate stage', number(decision.predicted_candidate_surplus)],
    ]));
    card.append(createElement('p', decisionReason(decision.reason), 'decision-reason'));
    card.append(createElement(
      'p',
      `The prediction holds household spending at ${number(decision.forecast_consumption_budget)} coins and holds the rival’s inherited price and automation fixed. It does not predict later wage and spending feedback.`,
      'fine',
    ));
    return card;
  }

  function renderAdoptionDecisions(row) {
    const container = element('adoption-decisions');
    const decisions = row.adoption_decisions ?? [];
    if (decisions.length === 0) {
      container.replaceChildren(createElement('p', 'No adoption decision was saved for this round.'));
      return;
    }
    container.replaceChildren(...decisions.map(adoptionDecisionCard));
  }

  function renderLaborNote(row) {
    const paid = row.firms.reduce((sum, firm) => sum + firm.wages_paid + firm.bonus_paid, 0);
    const due = row.firms.reduce((sum, firm) => sum + firm.wage_arrears, 0);
    const paymentNote = due > 1e-8
      ? `${number(due)} coins of contracted wages remain unpaid.`
      : 'All contracted wages are paid.';
    write(
      'labor-note',
      `Workers receive ${number(paid)} coins in wages and bonuses this round. ${paymentNote} Gifted dividend rights, where enabled, are separate from wages.`,
    );
  }

  function renderFlowNote(row) {
    write(
      'flow-note',
      `Households spend ${number(row.nominal_consumption)} coins on ${number(row.real_consumption)} baskets. Shops pay ${number(row.ai_provider_revenue)} coins for AI services. Equipment purchases add ${number(row.investment)} to final spending. Nominal GDP is ${number(row.nominal_gdp)}.`,
    );
  }

  function renderWorkers(row) {
    const rows = row.worker_income.map((income, index) => tableRow([
      index + 1,
      number(income),
      number(row.worker_consumption_by_person?.[index]),
      number(row.worker_real_consumption_by_person?.[index]),
      number(row.worker_closing_cash?.[index] ?? row.closing_balances[`worker_${index + 1}`]),
    ]));
    element('worker-rows').replaceChildren(...rows);
  }

  function renderAccounts(record, row) {
    const rows = Object.keys(row.closing_balances).map(account => tableRow([
      account.replaceAll('_', ' '),
      number(row.opening_balances[account]),
      number(row.closing_balances[account]),
    ]));
    element('account-rows').replaceChildren(...rows);
    const closingMoney = Object.values(row.closing_balances).reduce((sum, cash) => sum + cash, 0);
    write(
      'cash-check',
      `Total closing money: ${number(closingMoney)}; initial money: ${number(record.money_stock)}. Payments move money between these accounts.`,
    );
  }

  function appendSvg(svg, tag, attributes, text) {
    const node = document.createElementNS(svgNamespace, tag);
    Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, value));
    if (text != null) node.textContent = text;
    svg.append(node);
    return node;
  }

  function chartScales(rows) {
    const ceiling = Math.max(
      100,
      ...rows.map(row => row.real_gdp),
      ...rows.map(row => row.worker_real_consumption),
    ) * 1.12;
    return {
      ceiling,
      x: period => 50 + 640 * period / Math.max(1, rows.at(-1).period),
      y: value => 250 - 220 * value / ceiling,
    };
  }

  function renderChartGrid(svg, rows, scales) {
    const ticks = [...new Set([0, 50, 100, Math.floor(scales.ceiling / 50) * 50])];
    ticks.forEach(value => {
      appendSvg(svg, 'line', {
        x1: 50, x2: 690, y1: scales.y(value), y2: scales.y(value), stroke: '#d6ddd3',
      });
      appendSvg(svg, 'text', {
        x: 40, y: scales.y(value) + 5, 'text-anchor': 'end',
      }, number(value));
    });
    appendSvg(svg, 'text', { x: 50, y: 280 }, 'Round 0');
    appendSvg(svg, 'text', { x: 690, y: 280, 'text-anchor': 'end' }, `Round ${rows.at(-1).period}`);
  }

  function renderChartSeries(svg, rows, selected, scales, value, color, dash = 'none') {
    appendSvg(svg, 'polyline', {
      points: rows.map(row => `${scales.x(row.period)},${scales.y(value(row))}`).join(' '),
      fill: 'none',
      stroke: color,
      'stroke-dasharray': dash,
      'stroke-width': 3,
    });
    appendSvg(svg, 'circle', {
      cx: scales.x(selected.period),
      cy: scales.y(value(selected)),
      r: 6,
      fill: color,
      stroke: '#fffdf8',
      'stroke-width': 2,
    });
  }

  function renderPathChart(rows, selected) {
    const svg = element('path-chart');
    const scales = chartScales(rows);
    svg.replaceChildren();
    renderChartGrid(svg, rows, scales);
    renderChartSeries(svg, rows, selected, scales, row => row.real_gdp, '#223c36');
    renderChartSeries(svg, rows, selected, scales, row => row.worker_real_consumption, '#236654', '7 5');
    appendSvg(svg, 'line', {
      x1: scales.x(selected.period),
      x2: scales.x(selected.period),
      y1: 25,
      y2: 250,
      stroke: '#a66d13',
      'stroke-dasharray': '4 4',
    });
  }

  function updateRound() {
    const { record, index, row } = selection();
    write('round-label', row.period);
    renderMetrics(row);
    renderFirms(row);
    renderAdoptionDecisions(row);
    renderLaborNote(row);
    renderFlowNote(row);
    renderWorkers(row);
    renderAccounts(record, row);
    renderPathChart(record.periods, row);
    write(
      'chart-note',
      record.stop_reason
        ? `This run stops in round ${record.periods.at(-1).period}: ${record.stop_reason.replaceAll('_', ' ')}. No output is invented after the stop.`
        : `All ${record.parameters.periods} rounds completed. A flat endpoint is not proof of a global optimum.`,
    );
    element('previous-round').disabled = index === 0;
    element('next-round').disabled = index === record.periods.length - 1;
  }

  function stopPlayback() {
    if (playback !== null) clearInterval(playback);
    playback = null;
    write('play-rounds', 'Play rounds');
  }

  function changeCase() {
    stopPlayback();
    const record = data[element('adoption-case').value];
    write('case-explanation', record.label);
    write(
      'case-status',
      record.stop_reason
        ? `Boundary reached in round ${record.periods.at(-1).period}: ${record.stop_reason.replaceAll('_', ' ')}. This is a recorded payment failure, not a forecast of permanent collapse.`
        : `This path completes ${record.parameters.periods} rounds.`,
    );
    element('case-status').className = record.stop_reason ? 'danger' : 'explanation';
    element('adoption-round').max = record.periods.length - 1;
    element('adoption-round').value = 0;
    write('case-inputs', JSON.stringify(record.parameters, null, 2));
    updateRound();
  }

  function moveRound(direction) {
    const slider = element('adoption-round');
    slider.value = Math.max(0, Math.min(Number(slider.max), Number(slider.value) + direction));
    updateRound();
  }

  function togglePlayback() {
    if (playback !== null) {
      stopPlayback();
      return;
    }
    const slider = element('adoption-round');
    if (Number(slider.value) === Number(slider.max)) {
      slider.value = 0;
      updateRound();
    }
    write('play-rounds', 'Pause');
    playback = setInterval(() => {
      moveRound(1);
      if (Number(slider.value) >= Number(slider.max)) stopPlayback();
    }, playbackIntervalMs);
  }

  function bindControls() {
    element('adoption-case').addEventListener('change', changeCase);
    element('adoption-round').addEventListener('input', () => {
      stopPlayback();
      updateRound();
    });
    element('previous-round').addEventListener('click', () => {
      stopPlayback();
      moveRound(-1);
    });
    element('next-round').addEventListener('click', () => {
      stopPlayback();
      moveRound(1);
    });
    element('play-rounds').addEventListener('click', togglePlayback);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopPlayback();
    });
  }

  bindControls();
  changeCase();
})();
