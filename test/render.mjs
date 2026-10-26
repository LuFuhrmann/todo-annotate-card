// Headless render + interaction test with a mocked `hass`. Writes screenshots.
// Usage: node test/render.mjs [fixture.json] [screenshot-prefix]
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixture = JSON.parse(readFileSync(process.argv[2] || resolve(root, "test/fixtures/demo.json"), "utf8"));
const prefix = process.argv[3] || "demo";
const outDir = resolve(root, "screenshots");
mkdirSync(outDir, { recursive: true });
const CHROME = process.env.CHROME_PATH || ["/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"].find(existsSync);

const THEMES = {
  hell: {
    "--primary-color": "#03a9f4", "--text-primary-color": "#ffffff", "--primary-text-color": "#212121",
    "--secondary-text-color": "#727272", "--card-background-color": "#ffffff", "--primary-background-color": "#fafafa",
    "--secondary-background-color": "#e5e5e5", "--divider-color": "rgba(0,0,0,.12)", "--warning-color": "#ff9800", "--error-color": "#db4437",
    "--input-fill-color": "#f5f5f5",
  },
  dunkel: {
    "--primary-color": "#03a9f4", "--text-primary-color": "#ffffff", "--primary-text-color": "#e1e1e1",
    "--secondary-text-color": "#9b9b9b", "--card-background-color": "#1c1c1c", "--primary-background-color": "#111111",
    "--secondary-background-color": "#282828", "--divider-color": "rgba(225,225,225,.12)", "--warning-color": "#ff9800", "--error-color": "#ef5350",
    "--input-fill-color": "#2a2a2a",
  },
};

const page_html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body{margin:0;padding:12px;font-family:Roboto,"Noto Sans",Arial,sans-serif;background:var(--primary-background-color);color:var(--primary-text-color);-webkit-font-smoothing:antialiased}
</style>
<script>
  class HaCard extends HTMLElement{constructor(){super();const s=this.attachShadow({mode:"open"});s.innerHTML='<style>:host{display:block;background:var(--card-background-color);border-radius:12px;border:1px solid var(--divider-color);color:var(--primary-text-color)}</style><slot></slot>'}}
  customElements.define("ha-card",HaCard);
</script>
<script type="module" src="/dist/todo-annotate-card.js"></script></head><body><div id="host"></div></body></html>`;

const server = createServer((req, res) => {
  if (req.url === "/" || req.url.startsWith("/?")) { res.setHeader("content-type", "text/html"); return res.end(page_html); }
  if (req.url.startsWith("/dist/")) { res.setHeader("content-type", "text/javascript"); return res.end(readFileSync(resolve(root, "." + req.url.split("?")[0]))); }
  if (req.url === "/favicon.ico") { res.statusCode = 204; return res.end(); }
  res.statusCode = 404; res.end();
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}/`;

const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
const results = [];
const check = (name, ok, info = "") => { results.push({ name, ok }); console.log(`${ok ? "PASS" : "FAIL"} ${name}${info ? " – " + info : ""}`); };

async function setup(theme, { editor = false, features = 127 } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, timezoneId: "Europe/Berlin", locale: fixture.language === "de" ? "de-DE" : "en-US", colorScheme: theme === "dunkel" ? "dark" : "light" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(base);
  await page.waitForFunction(() => customElements.get("todo-annotate-card"));
  await page.evaluate(({ vars, fixture, editor, features }) => {
    for (const [k, v] of Object.entries(vars)) document.documentElement.style.setProperty(k, v);
    let items = structuredClone(fixture.items);
    const subs = new Set();
    const push = () => subs.forEach((cb) => cb({ items: structuredClone(items) }));
    window.__calls = [];
    const hass = {
      language: fixture.language, locale: { language: fixture.language },
      states: { [fixture.entity]: { entity_id: fixture.entity, state: String(items.filter((i) => i.status === "needs_action").length), attributes: { friendly_name: fixture.friendly_name, supported_features: features } },
                "todo.einkauf": { entity_id: "todo.einkauf", state: "0", attributes: { friendly_name: "Einkauf", supported_features: 127 } } },
      connection: { subscribeMessage: async (cb, msg) => { subs.add(cb); setTimeout(() => cb({ items: structuredClone(items) }), 0); return () => subs.delete(cb); } },
      callService: async (domain, service, data, target) => {
        window.__calls.push({ domain, service, data, target });
        const it = items.find((i) => i.uid === data.item);
        if (data.status) it.status = data.status;
        if (data.description !== undefined) it.description = data.description;
        setTimeout(push, 30);
      },
    };
    window.__items = () => items;
    const host = document.getElementById("host");
    if (editor) {
      const ed = document.createElement("todo-annotate-card-editor");
      ed.hass = hass; ed.setConfig({ type: "custom:todo-annotate-card", entity: fixture.entity, ...fixture.config });
      const wrap = document.createElement("ha-card"); wrap.style.padding = "16px"; wrap.appendChild(ed); host.appendChild(wrap);
    } else {
      const card = document.createElement("todo-annotate-card");
      card.setConfig({ type: "custom:todo-annotate-card", entity: fixture.entity, ...fixture.config });
      card.hass = hass; host.appendChild(card);
    }
  }, { vars: THEMES[theme], fixture, editor, features });
  await page.waitForTimeout(200);
  return { ctx, page, errors };
}

const card = (page) => page.locator("todo-annotate-card");
const shot = async (page, name) => {
  const file = `${outDir}/${prefix}-${name}.png`;
  const el = page.locator("#host");
  await el.screenshot({ path: file });
  return file;
};

const annotatedIdx = fixture.items.findIndex((i) => /\n?.*:\s/.test(i.description || "") && i.description.split("\n").some((l) => l.trim().startsWith((fixture.config.format || "❗ Abweichung: {text}").split("{text}")[0].trim())));
const openIdx = fixture.items.findIndex((i, k) => i.status === "needs_action" && k !== annotatedIdx);

for (const theme of ["hell", "dunkel"]) {
  // 1) overview
  let { ctx, page, errors } = await setup(theme);
  const rows = card(page).locator("li.item");
  check(`${theme}: renders all items`, (await rows.count()) === fixture.items.length, `${await rows.count()} rows`);
  const annRow = rows.nth(annotatedIdx);
  check(`${theme}: annotated row shows marker`, (await annRow.locator(".marker").count()) === 1);
  check(`${theme}: annotated row hides base text`, (await annRow.locator(".base").count()) === 0);
  await shot(page, `${theme}-1-uebersicht`);

  // 2) expand annotated
  await annRow.locator("button.main").click();
  await page.waitForTimeout(100);
  check(`${theme}: tap shows base text`, (await annRow.locator(".base").count()) === 1);
  check(`${theme}: aria-expanded true`, (await annRow.locator("button.main").getAttribute("aria-expanded")) === "true");
  await annRow.scrollIntoViewIfNeeded();
  await shot(page, `${theme}-2-aufgeklappt`);

  // 3) open editor on an open item, type text
  const openRow = rows.nth(openIdx);
  await openRow.locator("label.ann input").click();
  await page.waitForTimeout(100);
  const field = openRow.locator(".editor .field");
  check(`${theme}: second checkbox opens editor`, (await field.count()) === 1);
  check(`${theme}: editor field focused`, await field.evaluate((el) => el.getRootNode().activeElement === el));
  const typed = fixture.typed ?? "Burger instead\nplus a soda";
  await field.fill(typed);
  await shot(page, `${theme}-3-eingabe`);

  // 4) save -> merged, completed, marker
  await openRow.locator(".btn.primary").click();
  await page.waitForTimeout(250);
  const call = await page.evaluate(() => window.__calls.at(-1));
  const tmpl = fixture.config.format || "❗ Abweichung: {text}";
  const expectedLine = tmpl.replace("{text}", typed.split("\n").map((l) => l.trim()).filter(Boolean).join(" / "));
  check(`${theme}: save calls todo.update_item`, call?.domain === "todo" && call?.service === "update_item" && call?.target?.entity_id === fixture.entity);
  check(`${theme}: save keeps base + appends line`, call?.data?.description === `${fixture.items[openIdx].description}\n${expectedLine}`, JSON.stringify(call?.data?.description));
  check(`${theme}: save auto-completes`, call?.data?.status === "completed");
  check(`${theme}: summary untouched`, !("rename" in (call?.data ?? {})) && (await page.evaluate((i) => window.__items()[i].summary, openIdx)) === fixture.items[openIdx].summary);
  check(`${theme}: row now annotated`, (await openRow.locator(".marker").count()) === 1 && (await openRow.locator(".editor").count()) === 0);
  await shot(page, `${theme}-4-gespeichert`);

  // 5) edit + remove annotation -> back to normal
  await openRow.locator("label.ann input").click();
  await page.waitForTimeout(100);
  check(`${theme}: edit prefills text`, (await openRow.locator(".editor .field").inputValue()).includes("\n"));
  await openRow.locator(".btn.danger").click();
  await page.waitForTimeout(250);
  const call2 = await page.evaluate(() => window.__calls.at(-1));
  check(`${theme}: remove restores original description`, call2?.data?.description === fixture.items[openIdx].description && call2?.data?.status === undefined);
  check(`${theme}: row back to normal`, (await openRow.locator(".marker").count()) === 0);

  // 6) done checkbox toggles status
  await openRow.locator("label.box:not(.ann) input").click();
  await page.waitForTimeout(150);
  const call3 = await page.evaluate(() => window.__calls.at(-1));
  check(`${theme}: done checkbox toggles status`, call3?.data?.status === "needs_action" || call3?.data?.status === "completed");

  // 7) keyboard: Escape closes editor
  await rows.nth(openIdx).locator("label.ann input").focus();
  await page.keyboard.press("Space");
  await page.waitForTimeout(100);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(100);
  check(`${theme}: keyboard space opens, Escape closes`, (await rows.nth(openIdx).locator(".editor").count()) === 0);

  // 8) XSS: summary/description with markup rendered as text
  await page.evaluate(() => {
    const items = window.__items();
    items[0].summary = '<img src=x onerror="window.__xss=1">';
  });
  check(`${theme}: no runtime errors`, errors.length === 0, errors.join(" | "));
  await ctx.close();

  // feature check message
  ({ ctx, page, errors } = await setup(theme, { features: 1 | 2 | 4 }));
  check(`${theme}: unsupported list shows message`, (await card(page).locator(".message.warning").count()) === 1);
  await ctx.close();

  // editor
  ({ ctx, page, errors } = await setup(theme, { editor: true }));
  check(`${theme}: editor renders`, (await page.locator("todo-annotate-card-editor select#f-entity").count()) === 1);
  await page.setViewportSize({ width: 390, height: 1500 });
  await shot(page, `${theme}-5-karteneditor`);
  check(`${theme}: editor no errors`, errors.length === 0, errors.join(" | "));
  await ctx.close();
}

// XSS check with injected markup in data
{
  const evil = structuredClone(fixture);
  const { ctx, page, errors } = await setup("hell");
  await page.evaluate(() => {
    const card = document.querySelector("todo-annotate-card");
    card._items = [{ uid: "x", summary: '<img src=x onerror="window.__xss=1">', status: "completed", description: 'Plan\n❗ Abweichung: <script>window.__xss=2</script><b>fett</b>' }];
  });
  await page.waitForTimeout(150);
  const xss = await page.evaluate(() => window.__xss);
  const imgs = await card(page).locator("img, b, script").count();
  check("xss: markup rendered as text", xss === undefined && imgs === 0);
  await ctx.close();
}

await browser.close();
server.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
