import { describe, expect, it } from "vitest";
import {
  applyChoice,
  clearChoice,
  DEFAULT_SLOT_PATTERN,
  dishesForSlot,
  dishInfo,
  dishPlanText,
  displayNote,
  orderForDay,
  parseChoice,
  plannedDishId,
  readDishes,
  readHints,
  slotOf,
  splitDishRef,
  withDishRef,
  type Dish,
} from "../src/dishes";
import { mergeMarkers, parseMarkers } from "../src/annotation";

const attrs = {
  stand: "2026-10-27",
  gerichte: [
    { id: "doener_box", name: "Döner-Box", slots: ["Mittag", "Nach dem Training"], kcal: 810, eiweiss_g: 47, geschaetzt: false, zeit_min: 5, ort: "Büro", kurz: "Hähnchen-Gyros, Reis, Salat" },
    { id: "muesli", name: "Müsli-Frühstück", slots: ["Frühstück"], kcal: "560", eiweiss_g: 17, geschaetzt: true, zeit_min: 3 },
    { id: "bad id!", name: "kaputt", slots: ["Mittag"] },
    { id: "ohne_name", slots: ["Mittag"] },
    { id: "doener_box", name: "Doppelt", slots: ["Mittag"] },
    "kein Objekt",
  ],
};
const dishes = readDishes(attrs);
const doener = dishes[0];
const muesli = dishes[1];
const plan = "Gyros-Wraps: 2 Wraps mit Hähnchen-Gyros. Ersatz: Brötchen / Backshop\n48 g Eiweiß · 805 kcal";

describe("readDishes", () => {
  it("keeps valid unique dishes and coerces numbers", () => {
    expect(dishes.map((d) => d.id)).toEqual(["doener_box", "muesli"]);
    expect(muesli.kcal).toBe(560);
    expect(muesli.geschaetzt).toBe(true);
  });
  it("accepts `dishes` and ignores missing lists", () => {
    expect(readDishes({ dishes: [{ id: "a", name: "A", slots: [] }] })).toHaveLength(1);
    expect(readDishes(undefined)).toEqual([]);
    expect(readDishes({ gerichte: "x" })).toEqual([]);
  });
});

describe("slots", () => {
  it("takes the slot after the time", () => {
    expect(slotOf("Mo 26.10. 10:30 Mittag")).toBe("Mittag");
    expect(slotOf("Di 27.10. 13:00 Snack im Auto")).toBe("Snack im Auto");
    expect(slotOf("Einkauf")).toBeNull();
  });
  it("uses a custom pattern and falls back on an invalid one", () => {
    expect(slotOf("Mittag – Mo", "^(\\S+)")).toBe("Mittag");
    expect(slotOf("Mo 26.10. 10:30 Mittag", "([")).toBe("Mittag");
    expect(DEFAULT_SLOT_PATTERN).toContain("(.+)");
  });
  it("filters by slot ignoring case and spacing", () => {
    expect(dishesForSlot(dishes, "nach  dem training").map((d) => d.id)).toEqual(["doener_box"]);
    expect(dishesForSlot(dishes, "Snack")).toEqual([]);
    expect(dishesForSlot(dishes, null)).toEqual([]);
  });
});

describe("dish texts", () => {
  it("formats short info, estimated values with ca.", () => {
    expect(dishInfo(doener, "de")).toBe("810 kcal · 47 g Eiweiß · 5 min · Büro");
    expect(dishInfo(muesli, "de")).toBe("ca. 560 kcal · ca. 17 g Eiweiß · 3 min");
    expect(dishInfo(muesli, "en")).toBe("~560 kcal · ~17 g protein · 3 min");
  });
  it("writes the plan text in the style of the plan", () => {
    expect(dishPlanText(doener, "de")).toBe("Döner-Box: Hähnchen-Gyros, Reis, Salat\n47 g Eiweiß · 810 kcal · 5 min");
    expect(dishPlanText({ id: "x", name: "X", slots: [], tage: [] })).toBe("X");
  });
});

describe("choice", () => {
  it("replaces the plan and keeps the previous plan in one line", () => {
    const b = applyChoice(plan, doener, "de");
    expect(b.split("\n")[0]).toBe("🔁 Gewählt: Döner-Box [doener_box]");
    expect(b).toContain("↩ Plan: Gyros-Wraps: 2 Wraps mit Hähnchen-Gyros. Ersatz: Brötchen / Backshop ¶ 48 g Eiweiß · 805 kcal");
    const p = parseChoice(b);
    expect(p.choice).toEqual({ id: "doener_box", name: "Döner-Box" });
    expect(p.text).toBe(dishPlanText(doener, "de"));
    expect(p.original).toBe(plan);
  });
  it("keeps the first plan when the dish changes again, and restores it", () => {
    const b2 = applyChoice(applyChoice(plan, doener, "de"), muesli, "de");
    expect(parseChoice(b2).choice?.id).toBe("muesli");
    expect(parseChoice(b2).original).toBe(plan);
    expect(clearChoice(b2)).toBe(plan);
    expect(clearChoice(plan)).toBe(plan);
  });
  it("reads English markers and plain text", () => {
    const b = applyChoice("", doener, "en");
    expect(b).toBe("🔁 Chosen: Döner-Box [doener_box]\nDöner-Box: Hähnchen-Gyros, Reis, Salat\n47 g protein · 810 kcal · 5 min");
    expect(parseChoice(b).original).toBeNull();
    expect(clearChoice(b)).toBe(parseChoice(b).text);
    expect(parseChoice(plan)).toEqual({ choice: null, text: plan, original: null });
  });
  it("survives annotation and skip lines", () => {
    const ann = { template: "❗ Abweichung: {text}", separator: " / " };
    const skip = { template: "⊘ Ausgelassen", separator: " / " };
    const desc = mergeMarkers(applyChoice(plan, doener, "de"), "nur halb", null, ann, skip);
    const m = parseMarkers(desc, ann, skip);
    expect(m.annotation).toBe("nur halb");
    expect(parseChoice(m.base).choice?.id).toBe("doener_box");
    expect(mergeMarkers(clearChoice(m.base), m.annotation, null, ann, skip)).toBe(`${plan}\n❗ Abweichung: nur halb`);
  });
  it("strips brackets and line breaks from names", () => {
    const odd: Dish = { id: "o", name: "A [b]\nc", slots: [], tage: [] };
    expect(applyChoice("", odd, "de").split("\n")[0]).toBe("🔁 Gewählt: A b c [o]");
  });
});

describe("dish reference in a note", () => {
  it("adds the reference as its own first line", () => {
    expect(withDishRef("", doener, dishes)).toBe("[doener_box] Döner-Box");
    expect(withDishRef("nur halbe Portion", doener, dishes)).toBe("[doener_box] Döner-Box\nnur halbe Portion");
  });
  it("replaces or removes an existing reference and keeps the rest", () => {
    const t = "[doener_box] Döner-Box extra scharf\nmit Cola";
    expect(withDishRef(t, muesli, dishes)).toBe("[muesli] Müsli-Frühstück\nextra scharf\nmit Cola");
    expect(withDishRef(t, null, dishes)).toBe("extra scharf\nmit Cola");
    expect(withDishRef("[weg] Altes Gericht", muesli, dishes)).toBe("[muesli] Müsli-Frühstück\nAltes Gericht");
  });
  it("works with a one-line field and the storage separator", () => {
    expect(withDishRef("nur halb", doener, dishes, " / ")).toBe("[doener_box] Döner-Box / nur halb");
  });
  it("hides the id when shown", () => {
    expect(splitDishRef("[doener_box] Döner-Box").ref).toEqual({ id: "doener_box" });
    expect(displayNote("[doener_box] Döner-Box\nnur halb")).toBe("Döner-Box\nnur halb");
    expect(displayNote("Döner [groß]")).toBe("Döner [groß]");
  });
});

describe("config", async () => {
  const { resolveConfig } = await import("../src/config");
  it("is off without a dish entity and on by default with one", () => {
    const off = resolveConfig({ type: "x", entity: "todo.a" });
    expect(off.dishes_entity).toBe("");
    const on = resolveConfig({ type: "x", entity: "todo.a", dishes_entity: " sensor.ernaehrung_gerichte " });
    expect(on.dishes_entity).toBe("sensor.ernaehrung_gerichte");
    expect(on.replan && on.dish_in_note).toBe(true);
    expect(resolveConfig({ type: "x", entity: "todo.a", dishes_entity: "sensor.g", replan: false }).replan).toBe(false);
  });
});

describe("catalog format of the coach", () => {
  const real = readDishes({
    gerichte: [
      { id: "muesli_milch_banane", name: "Müsli mit Milch und Banane", slots: ["Frühstück"], kcal: 560, eiweiss_g: 17, geschaetzt: true, zeit_min: 3, ort: ["zu Hause", "Büro"], tage: ["training", "ruhe"], kurz: "80 g Früchtemüsli, 250 ml Milch, 1 Banane." },
      { id: "pfannkuchen", name: "Pfannkuchen", slots: ["Frühstück"], kcal: 600, eiweiss_g: 20, geschaetzt: true, zeit_min: 20, ort: ["zu Hause"], tage: ["ruhe"] },
      { id: "toast_honig", name: "Toast mit Honig", slots: ["Frühstück"], tage: ["training"] },
    ],
  });
  it("joins a list of places and keeps day types", () => {
    expect(real[0].ort).toBe("zu Hause, Büro");
    expect(real[0].tage).toEqual(["training", "ruhe"]);
    expect(dishInfo(real[0], "de")).toBe("ca. 560 kcal · ca. 17 g Eiweiß · 3 min · zu Hause, Büro");
  });
  it("finds the planned dish by gericht_id, else by the name before the first colon", () => {
    expect(plannedDishId("Müsli mit Milch und Banane: 80 g Früchtemüsli\n17 g Eiweiß · 560 kcal", real)).toBe("muesli_milch_banane");
    expect(plannedDishId("Pfannkuchen", real)).toBe("pfannkuchen");
    expect(plannedDishId("Irgendwas: x", real, { gericht_id: "pfannkuchen" })).toBe("pfannkuchen");
    expect(plannedDishId("Pfannkuchen: x", real, { gericht_id: "gibt_es_nicht" })).toBe("pfannkuchen");
    expect(plannedDishId("40 g Studentenfutter. Ersatz: Brezel", real)).toBeNull();
  });
  it("lists dishes for the day type first", () => {
    const o = orderForDay(real, "training");
    expect(o.map((r) => [r.dish.id, r.fits])).toEqual([["muesli_milch_banane", true], ["toast_honig", true], ["pfannkuchen", false]]);
    expect(orderForDay(real).every((r) => r.fits)).toBe(true);
  });
  it("reads item hints and ignores bad ones", () => {
    const h = readHints({ punkte: { "Mi 28.10. 06:00 Frühstück": { gericht_id: "pfannkuchen", tag: "ruhe" }, x: "kaputt", y: { gericht_id: "bad id" } } });
    expect(h.get("Mi 28.10. 06:00 Frühstück")).toEqual({ gericht_id: "pfannkuchen", tag: "ruhe" });
    expect(h.get("y")).toEqual({});
    expect(h.has("x")).toBe(false);
    expect(readHints({ punkte: [] }).size).toBe(0);
  });
});
