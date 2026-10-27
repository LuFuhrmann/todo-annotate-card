/**
 * Pure helpers for a dish catalog (for example a coach's meal list) published
 * as attributes of a Home Assistant entity, and for the two ways the card uses it:
 *
 * 1. Change dish ("Umplanen"): the item's plan text is replaced by a dish. The
 *    description then starts with a marker line and keeps the previous plan in
 *    one line, so the plan can be restored:
 *
 *        🔁 Gewählt: Döner-Box [doener_box]
 *        Döner-Box: Hähnchen-Gyros, Reis, Salat
 *        47 g Eiweiß · 810 kcal · 15 min
 *        ↩ Plan: <previous plan, line breaks stored as " ¶ ">
 *
 * 2. Dish in a note: the note text starts with a reference `[id] Name`,
 *    for example `[doener_box] Döner-Box / nur halbe Portion`.
 *
 * Annotation and skip lines are handled by annotation.ts; these helpers only
 * see the plan part (`base`).
 */

export interface Dish {
  id: string;
  name: string;
  slots: string[];
  kcal?: number;
  eiweiss_g?: number;
  geschaetzt?: boolean;
  zeit_min?: number;
  /** Where it fits, shown as text (a list is joined with ", "). */
  ort?: string;
  /** Day types the dish fits, e.g. ["training", "ruhe"]. Empty = any day. */
  tage: string[];
  kurz?: string;
}

/** Per-item hint published next to the catalog: planned dish and day type. */
export interface ItemHint {
  gericht_id?: string;
  tag?: string;
}

export interface DishRef {
  id: string;
  name: string;
}

export interface ParsedChoice {
  /** The chosen dish, or null when the item follows its original plan. */
  choice: DishRef | null;
  /** Plan text to show (the dish text when a dish was chosen). */
  text: string;
  /** Plan before the first change, or null. */
  original: string | null;
}

/** Item summaries like "Mo 26.10. 10:30 Mittag": the slot is everything after the time. */
export const DEFAULT_SLOT_PATTERN = "^\\S+\\s+\\S+\\s+\\d{1,2}:\\d{2}\\s+(.+)$";
/** Stands for a line break inside the stored previous plan. */
export const NEWLINE_TOKEN = " ¶ ";

const ID_RE = /^[A-Za-z0-9_.-]{1,64}$/;
const CHOICE_RE = /^\s*🔁\s*(?:Gewählt|Gewaehlt|Chosen)\s*:\s*(.*?)\s*\[([A-Za-z0-9_.-]{1,64})\]\s*$/u;
const ORIGINAL_RE = /^\s*↩\s*(?:Plan|Planned)\s*:\s*(.*?)\s*$/u;
const REF_RE = /^\s*\[([A-Za-z0-9_.-]{1,64})\]\s*/;

const str = (v: unknown, max: number): string | undefined =>
  typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined;
const strList = (v: unknown, max: number): string[] =>
  (Array.isArray(v) ? v : typeof v === "string" ? [v] : [])
    .filter((x): x is string => typeof x === "string" && !!x.trim())
    .map((x) => x.trim().slice(0, max));
const num = (v: unknown): number | undefined => {
  const n = typeof v === "string" ? Number(v.replace(",", ".")) : v;
  return typeof n === "number" && Number.isFinite(n) ? n : undefined;
};

/** Reads the dish list from entity attributes (`gerichte` or `dishes`). Invalid entries are skipped. */
export function readDishes(attributes: Record<string, unknown> | undefined): Dish[] {
  const raw = attributes?.gerichte ?? attributes?.dishes;
  if (!Array.isArray(raw)) return [];
  const out: Dish[] = [];
  const seen = new Set<string>();
  for (const r of raw) {
    if (!r || typeof r !== "object") continue;
    const o = r as Record<string, unknown>;
    const id = typeof o.id === "string" ? o.id.trim() : "";
    const name = str(o.name, 120);
    if (!ID_RE.test(id) || !name || seen.has(id)) continue;
    seen.add(id);
    const slots = Array.isArray(o.slots) ? o.slots.filter((s): s is string => typeof s === "string" && !!s.trim()).map((s) => s.trim()) : [];
    out.push({
      id,
      name,
      slots,
      kcal: num(o.kcal),
      eiweiss_g: num(o.eiweiss_g),
      geschaetzt: o.geschaetzt === true,
      zeit_min: num(o.zeit_min),
      ort: strList(o.ort, 40).join(", ").slice(0, 80) || undefined,
      tage: strList(o.tage, 20),
      kurz: str(o.kurz, 300),
    });
  }
  return out;
}

/** Item hints from the `punkte` attribute: item summary -> {gericht_id, tag}. */
export function readHints(attributes: Record<string, unknown> | undefined): Map<string, ItemHint> {
  const raw = attributes?.punkte;
  const out = new Map<string, ItemHint>();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
  for (const [summary, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!v || typeof v !== "object") continue;
    const o = v as Record<string, unknown>;
    const h: ItemHint = {};
    if (typeof o.gericht_id === "string" && ID_RE.test(o.gericht_id)) h.gericht_id = o.gericht_id;
    if (typeof o.tag === "string" && o.tag.trim()) h.tag = o.tag.trim();
    out.set(summary, h);
  }
  return out;
}

/**
 * Dish the item's plan is based on: the published `gericht_id`, otherwise the
 * catalog name that equals the plan text before the first ": ".
 */
export function plannedDishId(planText: string, dishes: Dish[], hint?: ItemHint): string | null {
  if (hint?.gericht_id && dishes.some((d) => d.id === hint.gericht_id)) return hint.gericht_id;
  const first = planText.replace(/\r\n?/g, "\n").split("\n")[0] ?? "";
  const i = first.indexOf(": ");
  const name = norm(i >= 0 ? first.slice(0, i) : first);
  if (!name) return null;
  return dishes.find((d) => norm(d.name) === name)?.id ?? null;
}

/** Dishes that fit the day type first (stable). `fits` is false only when the dish names other day types. */
export function orderForDay(dishes: Dish[], tag?: string): { dish: Dish; fits: boolean }[] {
  const rows = dishes.map((dish) => ({ dish, fits: !tag || dish.tage.length === 0 || dish.tage.includes(tag) }));
  return [...rows.filter((r) => r.fits), ...rows.filter((r) => !r.fits)];
}

const norm = (s: string): string => s.normalize("NFC").replace(/\s+/g, " ").trim().toLocaleLowerCase("de");

/** Slot of an item summary, or null. An invalid pattern falls back to the default. */
export function slotOf(summary: string, pattern?: string): string | null {
  let re: RegExp;
  try {
    re = new RegExp(pattern || DEFAULT_SLOT_PATTERN, "u");
  } catch {
    re = new RegExp(DEFAULT_SLOT_PATTERN, "u");
  }
  const m = re.exec(summary);
  const slot = m ? (m[1] ?? m[0]) : "";
  return slot.trim() || null;
}

/** Dishes that fit a slot (case and spacing ignored), in catalog order. */
export function dishesForSlot(dishes: Dish[], slot: string | null): Dish[] {
  if (!slot) return [];
  const s = norm(slot);
  return dishes.filter((d) => d.slots.some((x) => norm(x) === s));
}

/** Short info such as "ca. 560 kcal · ca. 17 g Eiweiß · 10 min · Büro". */
export function dishInfo(d: Dish, lang?: string): string {
  const de = (lang ?? "en").toLowerCase().startsWith("de");
  const approx = d.geschaetzt ? (de ? "ca. " : "~") : "";
  const fmt = (n: number) => (de ? String(n).replace(".", ",") : String(n));
  const parts: string[] = [];
  if (d.kcal !== undefined) parts.push(`${approx}${fmt(d.kcal)} kcal`);
  if (d.eiweiss_g !== undefined) parts.push(`${approx}${fmt(d.eiweiss_g)} g ${de ? "Eiweiß" : "protein"}`);
  if (d.zeit_min !== undefined) parts.push(`${fmt(d.zeit_min)} min`);
  if (d.ort) parts.push(d.ort);
  return parts.join(" · ");
}

const lines = (s: string): string[] => s.replace(/\r\n?/g, "\n").split("\n");

/** Splits the plan part of a description into the chosen dish, the shown text and the previous plan. */
export function parseChoice(base: string | null | undefined): ParsedChoice {
  const all = lines(base ?? "");
  let choice: DishRef | null = null;
  let original: string | null = null;
  const rest: string[] = [];
  for (const l of all) {
    const c = CHOICE_RE.exec(l);
    if (c && !choice) {
      choice = { id: c[2], name: c[1] };
      continue;
    }
    const o = ORIGINAL_RE.exec(l);
    if (o && original === null) {
      original = o[1].split(NEWLINE_TOKEN.trim()).map((x) => x.trim()).join("\n").trim();
      continue;
    }
    rest.push(l);
  }
  if (!choice) return { choice: null, text: (base ?? "").replace(/\r\n?/g, "\n").trim(), original: null };
  return { choice, text: rest.join("\n").trim(), original };
}

/** Plan text written for a dish: "Name: kurz" and a nutrition line in the style of the plan. */
export function dishPlanText(d: Dish, lang?: string): string {
  const de = (lang ?? "en").toLowerCase().startsWith("de");
  const first = d.kurz ? `${d.name}: ${d.kurz}` : d.name;
  const approx = d.geschaetzt ? (de ? "ca. " : "~") : "";
  const parts: string[] = [];
  if (d.eiweiss_g !== undefined) parts.push(`${approx}${d.eiweiss_g} g ${de ? "Eiweiß" : "protein"}`);
  if (d.kcal !== undefined) parts.push(`${approx}${d.kcal} kcal`);
  if (d.zeit_min !== undefined) parts.push(`${d.zeit_min} min`);
  return parts.length ? `${first}\n${parts.join(" · ")}` : first;
}

const clean = (s: string): string => s.replace(/[\r\n\]\[]+/g, " ").replace(/\s+/g, " ").trim();

/**
 * New plan part after choosing `d`. The previous plan is kept once (the plan
 * before the first change), so "back to plan" always returns to it.
 */
export function applyChoice(base: string, d: Dish, lang?: string): string {
  const de = (lang ?? "en").toLowerCase().startsWith("de");
  const p = parseChoice(base);
  const original = p.choice ? (p.original ?? "") : p.text;
  const out = [`🔁 ${de ? "Gewählt" : "Chosen"}: ${clean(d.name)} [${d.id}]`, dishPlanText(d, lang)];
  if (original) out.push(`↩ ${de ? "Plan" : "Planned"}: ${lines(original).map((l) => l.trim()).filter(Boolean).join(NEWLINE_TOKEN)}`);
  return out.join("\n");
}

/** Plan part with the choice removed: the previous plan if it was kept, otherwise the text. */
export function clearChoice(base: string): string {
  const p = parseChoice(base);
  if (!p.choice) return p.text;
  return p.original ?? p.text;
}

/** Reference at the start of a note ("[id] Name …"), or null. */
export function splitDishRef(text: string): { ref: { id: string } | null; rest: string } {
  const m = REF_RE.exec(text);
  if (!m) return { ref: null, rest: text };
  return { ref: { id: m[1] }, rest: text.slice(m[0].length) };
}

/**
 * Sets or removes the dish reference as the first line of a note. An old
 * reference line is replaced; text after the old dish name is kept.
 * `joiner` is "\n" for a textarea and the storage separator for a one-line field.
 */
export function withDishRef(text: string, d: Dish | null, dishes: Dish[] = [], joiner = "\n"): string {
  const ls = joiner === "\n" ? lines(text) : text.split(joiner);
  let restLines = ls;
  const { ref, rest } = splitDishRef(ls[0] ?? "");
  if (ref) {
    let tail = rest.trim();
    const old = dishes.find((x) => x.id === ref.id);
    if (old && tail.startsWith(clean(old.name))) tail = tail.slice(clean(old.name).length).replace(/^\s*[-–:,;·]?\s*/, "");
    restLines = [tail, ...ls.slice(1)];
  }
  const head = d ? `[${d.id}] ${clean(d.name)}` : "";
  return [head, ...restLines].map((l) => l.trim()).filter(Boolean).join(joiner);
}

/** Note text for display: the reference id is hidden, the name stays. */
export function displayNote(text: string): string {
  return lines(text).map((l, i) => (i === 0 ? splitDishRef(l).rest : l)).join("\n");
}
