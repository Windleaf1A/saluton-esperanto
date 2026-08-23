import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Esperanto learning platform", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>saluton! — 用中文學 Esperanto<\/title>/i);
  assert.match(html, /詞尾積木/);
  assert.match(html, /隨機題庫/);
  assert.match(html, /逆翻譯練習/);
  assert.doesNotMatch(html, /Your site is taking shape/);
});

test("includes randomized practice, completion, and x-system support", async () => {
  const [page, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.equal((page.match(/id: "[a-z-]+",\n\s+english:/g) ?? []).length, 12);
  assert.equal((page.match(/checks: \[/g) ?? []).length, 6);
  assert.match(page, /function shuffleIndexes/);
  assert.match(page, /function convertXSystem/);
  assert.match(page, /setTranslation\(converted\)/);
  assert.match(page, /className="content-wrap course-complete"/);
  assert.match(page, /Vi sukcesis/);
  assert.match(css, /\.course-complete/);
});
