#!/usr/bin/env node
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import process from "node:process";

function argument(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const deckPath = path.resolve(argument("deck", ""));
const port = Number(argument("port", "4175"));
const cuts = argument("cuts", "part1,part2").split(",").map((value) => value.trim()).filter(Boolean);
if (!deckPath || !fs.existsSync(path.join(deckPath, "index.html")) || !Number.isInteger(port)) {
  console.error("Usage: review-server.mjs --deck <deck-directory> [--port 4175] [--cuts part1,part2]");
  process.exit(2);
}

const html = fs.readFileSync(path.join(deckPath, "index.html"), "utf8");
const version = html.match(/styles\.css\?v=([^"']+)/)?.[1] ?? Date.now();
const mime = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
]);

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url ?? "/", `http://127.0.0.1:${port}`);
  const relative = requestUrl.pathname === "/" ? "index.html" : decodeURIComponent(requestUrl.pathname.slice(1));
  const resolved = path.resolve(deckPath, relative);
  if (!resolved.startsWith(`${deckPath}${path.sep}`) && resolved !== path.join(deckPath, "index.html")) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  fs.readFile(resolved, (error, data) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500).end(error.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }
    response.writeHead(200, { "Content-Type": mime.get(path.extname(resolved).toLowerCase()) ?? "application/octet-stream", "Cache-Control": "no-store" });
    response.end(data);
  });
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Verify the existing deck before sharing links.`);
  } else {
    console.error(error);
  }
  process.exit(1);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Serving ${deckPath}`);
  for (const cut of cuts) console.log(`http://127.0.0.1:${port}/?cut=${encodeURIComponent(cut)}&scene=0&v=${version}`);
});
