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

async function setup(theme, { editor = false, features = 127, config = {}, fx = fixture, extraStates = {} } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, timezoneId: "Europe/Berlin", locale: fx.language === "de" ? "de-DE" : "en-US", colorScheme: theme === "dunkel" ? "dark" : "light" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(base);
  await page.waitForFunction(() => customElements.get("todo-annotate-card"));
  await page.evaluate(({ vars, fixture, editor, features, config, extraStates }) => {
    for (const [k, v] of Object.entries(vars)) document.documentElement.style.setProperty(k, v);
    let items = structuredClone(fixture.items);
    const subs = new Set();
    const push = () => subs.forEach((cb) => cb({ items: structuredClone(items) }));
    window.__calls = [];
    const hass = {
      language: fixture.language, locale: { language: fixture.language },
      states: { [fixture.entity]: { entity_id: fixture.entity, state: String(items.filter((i) => i.status === "needs_action").length), attributes: { friendly_name: fixture.friendly_name, supported_features: features } },
                "todo.einkauf": { entity_id: "todo.einkauf", state: "0", attributes: { friendly_name: "Einkauf", supported_features: 127 } }, ...extraStates },
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
      card.setConfig({ type: "custom:todo-annotate-card", entity: fixture.entity, ...fixture.config, ...config });
      card.hass = hass; host.appendChild(card);
    }
  }, { vars: THEMES[theme], fixture: fx, editor, features, config, extraStates });
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
  check(`${theme}: unsaved hint`, (await openRow.locator(".pending").innerText()).trim() === "Not saved yet");
  check(`${theme}: annotation checkbox indeterminate`, await openRow.locator("label.ann input").evaluate((el) => el.indeterminate === true));
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

// Regression: typed text must survive every way of leaving the editor except Cancel.
{
  const rowText = async (page, index) => {
    const rows = card(page).locator("li.item");
    const row = rows.nth(index);
    await row.locator("label.ann input").click();
    await page.waitForTimeout(80);
    await row.locator(".editor .field").fill("Pizza with colleagues");
    return row;
  };
  const lastCall = (page) => page.evaluate(() => window.__calls.at(-1));

  {
    const { ctx, page } = await setup("hell");
    const row = await rowText(page, openIdx);
    await row.locator("label.ann input").click();
    await page.waitForTimeout(250);
    const call = await lastCall(page);
    check("A: checkbox saves typed text", call?.data?.description?.endsWith("❗ Deviation: Pizza with colleagues") === true, JSON.stringify(call?.data));
    check("A: editor closes", (await row.locator(".editor").count()) === 0);
    check("A: draft cleared", await page.evaluate(() => Object.keys(localStorage).every((k) => !k.startsWith("todo-annotate-card:draft:"))));
    await ctx.close();
  }
  {
    const { ctx, page } = await setup("hell");
    const row = await rowText(page, openIdx);
    const other = card(page).locator("li.item").nth(openIdx === 0 ? 1 : 0);
    await other.locator("label.ann input").click();
    await page.waitForTimeout(250);
    const call = await lastCall(page);
    check("B: other editor saves the first text", call?.data?.item === fixture.items[openIdx].uid && call?.data?.description?.includes("❗ Deviation: Pizza with colleagues"), JSON.stringify(call?.data));
    check("B: first editor closed", (await row.locator(".editor").count()) === 0);
    check("B: second editor open", (await other.locator(".editor").count()) === 1);
    await ctx.close();
  }
  {
    const { ctx, page } = await setup("hell");
    const row = await rowText(page, openIdx);
    await row.locator("label.box.done input").click();
    await page.waitForTimeout(250);
    const call = await lastCall(page);
    check("C: done sends text", call?.data?.description?.includes("❗ Deviation: Pizza with colleagues") === true, JSON.stringify(call?.data));
    check("C: done sends status", call?.data?.status === "completed" || call?.data?.status === "needs_action");
    await ctx.close();
  }
  {
    const { ctx, page } = await setup("hell");
    const row = await rowText(page, openIdx);
    const before = await page.evaluate(() => window.__calls.length);
    await row.locator(".btn:not(.primary):not(.danger)").click();
    await page.waitForTimeout(100);
    const after = await page.evaluate(() => window.__calls.length);
    check("Cancel: no service call", before === after);
    check("Cancel: editor closed", (await row.locator(".editor").count()) === 0);
    await row.locator("label.ann input").click();
    await page.waitForTimeout(80);
    check("Cancel: draft restored", (await row.locator(".editor .field").inputValue()) === "Pizza with colleagues");
    await ctx.close();
  }
}

// Optional third checkbox. Formats are the ones a sync script should parse.
{
  const flag = "⊘ Ausgelassen";
  const reasonFmt = "⊘ Ausgelassen: {text}";
  const { ctx, page } = await setup("hell", { config: { skip: true, skip_format: flag } });
  const rows = card(page).locator("li.item");
  check("skip: third column", (await rows.nth(openIdx).locator("label.box.skip input").count()) === 1);
  check("skip: legend entry", (await card(page).locator(".sw.skip").count()) === 1);
  await rows.nth(openIdx).locator("label.box.skip input").click();
  await page.waitForTimeout(250);
  let call = await page.evaluate(() => window.__calls.at(-1));
  check("skip: flag line and done", call?.data?.description === `${fixture.items[openIdx].description}\n${flag}` && call?.data?.status === "completed", JSON.stringify(call?.data));
  check("skip: summary untouched", !("summary" in (call?.data ?? {})));
  await rows.nth(openIdx).locator("label.box.skip input").click();
  await page.waitForTimeout(250);
  call = await page.evaluate(() => window.__calls.at(-1));
  check("skip: uncheck keeps done", call?.data?.description === fixture.items[openIdx].description && call?.data?.status === undefined, JSON.stringify(call?.data));
  await ctx.close();

  const noted = fixture.items.findIndex((i) => (i.description || "").includes("Deviation"));
  const { ctx: ctx2, page: page2 } = await setup("hell", { config: { skip: true, skip_format: flag } });
  const notedRow = card(page2).locator("li.item").nth(noted);
  await notedRow.locator("label.box.skip input").click();
  await page2.waitForTimeout(80);
  check("skip: confirm before replacing a note", (await notedRow.locator(".confirm").count()) === 1);
  check("skip: confirm sends nothing yet", await page2.evaluate(() => window.__calls.length === 0));
  await notedRow.locator(".confirm .btn.danger").click();
  await page2.waitForTimeout(250);
  call = await page2.evaluate(() => window.__calls.at(-1));
  check("skip: confirm drops the note", call?.data?.description?.endsWith(`\n${flag}`) && !call.data.description.includes("Deviation"), JSON.stringify(call?.data));
  await notedRow.locator("label.box.done input").click();
  await page2.waitForTimeout(250);
  call = await page2.evaluate(() => window.__calls.at(-1));
  check("skip: unchecking done removes the flag", call?.data?.status === "needs_action" && !String(call?.data?.description ?? "").includes(flag), JSON.stringify(call?.data));
  await ctx2.close();

  const { ctx: ctx3, page: page3 } = await setup("hell", { config: { skip: true, skip_format: reasonFmt } });
  const reasonRow = card(page3).locator("li.item").nth(openIdx);
  await reasonRow.locator("label.box.skip input").click();
  await page3.waitForTimeout(80);
  check("skip: reason format opens an editor", (await reasonRow.locator(".editor").count()) === 1);
  await reasonRow.locator(".editor .field").fill("keine Zeit");
  await reasonRow.locator(".btn.primary").click();
  await page3.waitForTimeout(250);
  call = await page3.evaluate(() => window.__calls.at(-1));
  check("skip: reason line", call?.data?.description?.endsWith("\n⊘ Ausgelassen: keine Zeit") && call?.data?.status === "completed", JSON.stringify(call?.data));
  check("skip: greyed name", (await reasonRow.locator(".skip-mark").count()) === 1 && (await reasonRow.locator(".text").innerText()) === fixture.items[openIdx].summary);
  await ctx3.close();
}

// Dish catalog (v1.2): change dish and pick a dish in the note editor.
// DISH_FIXTURE / DISH_PREFIX run the same checks on private data (e.g. the real catalog).
{
  const fxPath = process.env.DISH_FIXTURE || resolve(root, "test/fixtures/gerichte-demo.json");
  const fx = JSON.parse(readFileSync(fxPath, "utf8"));
  const dprefix = process.env.DISH_PREFIX || "gerichte";
  const catalog = JSON.parse(readFileSync(resolve(dirname(fxPath), fx.catalog), "utf8"));
  // Same compact attributes as the sync script publishes (no zubereitung/zutaten).
  const keep = ["id", "name", "slots", "kcal", "eiweiss_g", "geschaetzt", "zeit_min", "ort", "tage", "kurz"];
  const gerichte = catalog.gerichte.map((g) => Object.fromEntries(keep.filter((k) => k in g).map((k) => [k, g[k]])));
  const attrs = { friendly_name: "Gerichte", stand: catalog.stand, slots: catalog.slots, gerichte, punkte: fx.punkte ?? {} };
  const extraStates = { [fx.dishes_entity]: { entity_id: fx.dishes_entity, state: catalog.stand, attributes: attrs } };
  const C = fx.dish_checks;
  const idx = (uid) => fx.items.findIndex((i) => i.uid === uid);
  const lunch = idx(C.lunch), post = idx(C.post), done = idx(C.done), late = C.late ? idx(C.late) : -1;
  const slotOfItem = (i) => fx.items[i].summary.replace(/^\S+\s+\S+\s+\d{1,2}:\d{2}\s+/, "");
  const fitsDay = (g, tag) => !tag || !(g.tage ?? []).length || g.tage.includes(tag);
  const expectedNames = (i) => {
    const slot = slotOfItem(i);
    const tag = (fx.punkte ?? {})[fx.items[i].summary]?.tag;
    const list = gerichte.filter((g) => g.slots.includes(slot));
    return [...list.filter((g) => fitsDay(g, tag)), ...list.filter((g) => !fitsDay(g, tag))].map((g) => g.name);
  };
  const ca = (g) => (g.geschaetzt ? "ca. " : "");
  const info = (g) => [g.kcal != null && `${ca(g)}${g.kcal} kcal`, g.eiweiss_g != null && `${ca(g)}${g.eiweiss_g} g Eiweiß`, g.zeit_min != null && `${g.zeit_min} min`, [].concat(g.ort ?? []).join(", ")].filter(Boolean).join(" · ");
  const planLine = (g) => [g.eiweiss_g != null && `${ca(g)}${g.eiweiss_g} g Eiweiß`, g.kcal != null && `${ca(g)}${g.kcal} kcal`, g.zeit_min != null && `${g.zeit_min} min`].filter(Boolean).join(" · ");
  const pick = gerichte.find((g) => g.id === C.replan_pick);
  const notePick = gerichte.find((g) => g.id === C.note_pick);
  const last = (page) => page.evaluate(() => window.__calls.at(-1));
  const dshot = async (page, name) => page.locator("#host").screenshot({ path: `${outDir}/${dprefix}-${name}.png` });
  for (const theme of ["hell", "dunkel"]) {
    const { ctx, page, errors } = await setup(theme, { fx, extraStates });
    const rows = card(page).locator("li.item");
    check(`${theme} dish: replan button on open items with dishes`, (await rows.nth(lunch).locator(".replan-btn").count()) === 1);
    check(`${theme} dish: none on done items`, (await rows.nth(done).locator(".replan-btn").count()) === 0);
    if (late >= 0) check(`${theme} dish: none when no dish fits the slot`, (await rows.nth(late).locator(".replan-btn").count()) === 0);
    await dshot(page, `${theme}-1-uebersicht`);

    await rows.nth(lunch).locator(".replan-btn").click();
    await page.waitForTimeout(100);
    const names = (await rows.nth(lunch).locator(".dish .dish-name").allInnerTexts()).map((n) => n.replace(/\s*·.*$/s, "").trim());
    const want = expectedNames(lunch);
    check(`${theme} dish: picker lists the slot's dishes, day type first`, JSON.stringify(names) === JSON.stringify(want), names.join(", "));
    const first = gerichte.find((g) => g.name === want[0]);
    const shownInfo = await rows.nth(lunch).locator(".dish .dish-info").first().innerText();
    check(`${theme} dish: short info`, shownInfo === info(first), `${shownInfo} | ${info(first)}`);
    const planned = (fx.punkte ?? {})[fx.items[lunch].summary]?.gericht_id;
    if (planned) check(`${theme} dish: planned dish marked`, (await rows.nth(lunch).locator(".dish", { hasText: "laut Plan" }).locator(".dish-name").innerText()).startsWith(gerichte.find((g) => g.id === planned).name));
    const pickerContrast = await rows.nth(lunch).locator(".picker").evaluate((picker) => {
      const parse = (c) => {
        const s = String(c).trim();
        let m = s.match(/rgba?\(([-\d.]+)[,\s]+([-\d.]+)[,\s]+([-\d.]+)(?:[,\s/]+([-\d.]+%?))?\)/i);
        if (m) {
          const a = m[4] == null ? 1 : m[4].endsWith("%") ? parseFloat(m[4]) / 100 : Number(m[4]);
          return { rgb: [Number(m[1]), Number(m[2]), Number(m[3])], a };
        }
        m = s.match(/color\(srgb\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)(?:\s*\/\s*([-\d.]+))?\)/i);
        if (m) {
          const ch = (v) => { const n = Number(v); return n <= 1 ? n * 255 : n; };
          return { rgb: [ch(m[1]), ch(m[2]), ch(m[3])], a: m[4] == null ? 1 : Number(m[4]) };
        }
        return null;
      };
      const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      const L = (rgb) => 0.2126 * lin(rgb[0] / 255) + 0.7152 * lin(rgb[1] / 255) + 0.0722 * lin(rgb[2] / 255);
      const ratio = (fg, bg) => {
        const hi = Math.max(L(fg), L(bg));
        const lo = Math.min(L(fg), L(bg));
        return (hi + 0.05) / (lo + 0.05);
      };
      const paint = (el) => {
        let bg = [255, 255, 255];
        const chain = [];
        for (let e = el; e; e = e.parentElement) chain.push(e);
        for (const e of chain.reverse()) {
          const b = parse(getComputedStyle(e).backgroundColor);
          if (!b || b.a === 0) continue;
          bg = bg.map((v, i) => b.rgb[i] * b.a + v * (1 - b.a));
        }
        const raw = getComputedStyle(el).color;
        const fg = parse(raw);
        return { ratio: fg ? ratio(fg.rgb, bg) : 0, raw };
      };
      const out = [];
      for (const dish of picker.querySelectorAll(".dish")) {
        for (const sel of [".dish-name", ".dish-info", ".dish-kurz", ".dish-cur", ".dish-day"]) {
          const el = dish.querySelector(sel);
          if (el) out.push({ sel, ...paint(el) });
        }
      }
      const title = picker.querySelector(".picker-title");
      if (title) out.push({ sel: ".picker-title", ...paint(title) });
      return out;
    });
    const weak = pickerContrast.filter((r) => r.ratio < 4.5);
    check(`${theme} dish: picker text meets WCAG AA`, weak.length === 0, weak.map((r) => `${r.sel} ${r.ratio.toFixed(2)} ${r.raw}`).join(", ") || `min ${Math.min(...pickerContrast.map((r) => r.ratio)).toFixed(2)}`);
    await rows.nth(lunch).locator(".picker").screenshot({ path: `${outDir}/${dprefix}-${theme}-2-picker.png` });
    await dshot(page, `${theme}-2-umplanen-auswahl`);

    await rows.nth(lunch).locator(".dish").nth(want.indexOf(pick.name)).click();
    await page.waitForTimeout(250);
    let call = await last(page);
    const d = call?.data?.description ?? "";
    const lines = d.split("\n");
    check(`${theme} dish: marker line with id`, lines[0] === `🔁 Gewählt: ${pick.name} [${pick.id}]`, JSON.stringify(d));
    check(`${theme} dish: plan text replaced`, lines[1] === (pick.kurz ? `${pick.name}: ${pick.kurz}` : pick.name) && lines[2] === planLine(pick), JSON.stringify(lines.slice(1, 3)));
    check(`${theme} dish: original kept in one line`, lines[3] === "↩ Plan: " + fx.items[lunch].description.split("\n").join(" ¶ "));
    check(`${theme} dish: status unchanged, summary untouched`, call?.data?.status === undefined && !("rename" in (call?.data ?? {})));
    check(`${theme} dish: row shows choice`, (await rows.nth(lunch).locator(".choice").innerText()).includes(`Gewählt: ${pick.name}`));
    check(`${theme} dish: picker closed`, (await rows.nth(lunch).locator(".picker").count()) === 0);
    await rows.nth(lunch).locator("button.main").click();
    await page.waitForTimeout(100);
    check(`${theme} dish: tap shows original plan`, (await rows.nth(lunch).locator(".original").innerText()).startsWith("Ursprünglich geplant: " + fx.items[lunch].description.split("\n")[0].slice(0, 20)));
    await dshot(page, `${theme}-3-umgeplant`);

    await rows.nth(lunch).locator(".replan-btn").click();
    await page.waitForTimeout(100);
    check(`${theme} dish: current dish marked`, (await rows.nth(lunch).locator(".dish.current").count()) === 1);
    await rows.nth(lunch).locator(".picker .btn.danger").click();
    await page.waitForTimeout(250);
    call = await last(page);
    check(`${theme} dish: back to plan restores the description`, call?.data?.description === fx.items[lunch].description, JSON.stringify(call?.data?.description));
    if (planned) {
      const n = (await page.evaluate(() => window.__calls.length));
      await rows.nth(lunch).locator(".replan-btn").click();
      await page.waitForTimeout(100);
      await rows.nth(lunch).locator(".dish", { hasText: "laut Plan" }).click();
      await page.waitForTimeout(150);
      check(`${theme} dish: picking the planned dish writes nothing`, (await page.evaluate(() => window.__calls.length)) === n && (await rows.nth(lunch).locator(".picker").count()) === 0);
    }

    // Note editor with the dish list
    await rows.nth(post).locator("label.ann input").click();
    await page.waitForTimeout(100);
    const sel = rows.nth(post).locator(".dish-select");
    check(`${theme} dish: select in note editor`, (await sel.count()) === 1);
    const selectContrast = await sel.evaluate((el) => {
      const parse = (c) => {
        const m = String(c).match(/rgba?\(([-\d.]+)[,\s]+([-\d.]+)[,\s]+([-\d.]+)(?:[,\s/]+([-\d.]+))?/);
        if (!m) return null;
        const a = m[4] == null ? 1 : Number(m[4]);
        return { rgb: [Number(m[1]), Number(m[2]), Number(m[3])], a };
      };
      const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      const L = (rgb) => 0.2126 * lin(rgb[0] / 255) + 0.7152 * lin(rgb[1] / 255) + 0.0722 * lin(rgb[2] / 255);
      const ratio = (fg, bg) => (Math.max(L(fg), L(bg)) + 0.05) / (Math.min(L(fg), L(bg)) + 0.05);
      const fg = parse(getComputedStyle(el).color);
      const bg = parse(getComputedStyle(el).backgroundColor);
      const opt = el.querySelector("option");
      const ofg = opt ? parse(getComputedStyle(opt).color) : null;
      const obg = opt ? parse(getComputedStyle(opt).backgroundColor) : null;
      return {
        control: fg && bg && bg.a > 0 ? ratio(fg.rgb, bg.rgb) : 0,
        option: ofg && obg && obg.a > 0 ? ratio(ofg.rgb, obg.rgb) : null,
      };
    });
    check(`${theme} dish: select text meets WCAG AA`, selectContrast.control >= 4.5 && (selectContrast.option == null || selectContrast.option >= 4.5), JSON.stringify(selectContrast));
    const groups = await sel.locator("optgroup").evaluateAll((g) => g.map((x) => x.label));
    check(`${theme} dish: fitting dishes first`, groups[0] === `Passt zu ${slotOfItem(post)}` && groups[1] === "Andere Gerichte", groups.join(" | "));
    await rows.nth(post).locator(".editor textarea.field").fill(C.typed);
    await sel.selectOption(notePick.id);
    await page.waitForTimeout(100);
    const val = await rows.nth(post).locator(".editor textarea.field").inputValue();
    check(`${theme} dish: pick sets the reference line, free text stays`, val === `[${notePick.id}] ${notePick.name}\n${C.typed}`, JSON.stringify(val));
    await dshot(page, `${theme}-4-abweichung-liste`);
    await rows.nth(post).locator(".btn.primary").click();
    await page.waitForTimeout(250);
    call = await last(page);
    check(`${theme} dish: stored note carries id`, call?.data?.description?.endsWith(`\n❗ Abweichung: [${notePick.id}] ${notePick.name} / ${C.typed}`) && call?.data?.status === "completed", JSON.stringify(call?.data));
    check(`${theme} dish: shown without id`, (await rows.nth(post).locator(".annotation").innerText()) === `${notePick.name}\n${C.typed}`);
    await dshot(page, `${theme}-5-abweichung-gespeichert`);
    check(`${theme} dish: no errors`, errors.length === 0, errors.join(" | "));
    await ctx.close();
  }
  {
    const { ctx, page, errors } = await setup("hell", { fx });
    check("dish: missing entity shows a hint", (await card(page).locator(".message.muted", { hasText: "Gerichteliste nicht verfügbar" }).count()) === 1);
    check("dish: no replan buttons without catalog", (await card(page).locator(".replan-btn").count()) === 0);
    await card(page).locator("li.item").nth(post).locator("label.ann input").click();
    await page.waitForTimeout(100);
    check("dish: no select without catalog", (await card(page).locator(".dish-select").count()) === 0);
    check("dish: no errors without catalog", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }
  {
    const { ctx, page } = await setup("hell", { fx, extraStates, config: { replan: false, dish_in_note: false } });
    check("dish: options can turn both off", (await card(page).locator(".replan-btn").count()) === 0);
    await ctx.close();
  }
}

await browser.close();
server.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
