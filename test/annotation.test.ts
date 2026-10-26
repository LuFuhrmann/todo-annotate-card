import { describe, expect, it } from "vitest";
import {
  DEFAULT_SEPARATOR,
  DEFAULT_TEMPLATE,
  decodeText,
  encodeText,
  mergeDescription,
  normalizeTemplate,
  parseDescription,
  withAnnotation,
} from "../src/annotation";

const fmt = { template: DEFAULT_TEMPLATE, separator: DEFAULT_SEPARATOR };
const PLAN = "Overnight Oats: 80 g Haferflocken, 250 ml Milch, 1 Banane\n22 g Eiweiß · 650 kcal";

describe("parseDescription", () => {
  it("returns base only for a plain description", () => {
    expect(parseDescription(PLAN, fmt)).toEqual({ base: PLAN, annotation: null });
  });
  it("handles empty / null", () => {
    expect(parseDescription(null, fmt)).toEqual({ base: "", annotation: null });
    expect(parseDescription("", fmt)).toEqual({ base: "", annotation: null });
  });
  it("extracts the annotation line", () => {
    const d = `${PLAN}\n❗ Abweichung: Brötchen statt Oats`;
    expect(parseDescription(d, fmt)).toEqual({ base: PLAN, annotation: "Brötchen statt Oats" });
  });
  it("tolerates whitespace and CRLF", () => {
    const d = `${PLAN.replace("\n", "\r\n")}\r\n  ❗Abweichung:   Döner  `;
    expect(parseDescription(d, fmt)).toEqual({ base: PLAN, annotation: "Döner" });
  });
  it("finds the line anywhere, last match wins", () => {
    const d = `❗ Abweichung: alt\n${PLAN}\n❗ Abweichung: neu`;
    const p = parseDescription(d, fmt);
    expect(p.annotation).toBe("neu");
    expect(p.base).toBe(`❗ Abweichung: alt\n${PLAN}`);
  });
  it("supports custom templates with suffix and regex characters", () => {
    const f = { template: "[Note (x)] {text} [/]", separator: " | " };
    expect(parseDescription("abc\n[Note (x)] a.b*c [/]", f)).toEqual({ base: "abc", annotation: "a.b*c" });
  });
  it("recognises an annotation with empty text as annotated", () => {
    expect(parseDescription(`${PLAN}\n❗ Abweichung:`, fmt).annotation).toBe("");
  });
});

describe("mergeDescription / withAnnotation", () => {
  it("appends the formatted line", () => {
    expect(mergeDescription(PLAN, "Döner", fmt)).toBe(`${PLAN}\n❗ Abweichung: Döner`);
  });
  it("replaces an existing annotation", () => {
    const d = `${PLAN}\n❗ Abweichung: alt`;
    expect(withAnnotation(d, "neu", fmt)).toBe(`${PLAN}\n❗ Abweichung: neu`);
  });
  it("removes the annotation for null / blank text", () => {
    const d = `${PLAN}\n❗ Abweichung: alt`;
    expect(withAnnotation(d, null, fmt)).toBe(PLAN);
    expect(withAnnotation(d, "   \n ", fmt)).toBe(PLAN);
  });
  it("works without base text", () => {
    expect(mergeDescription("", "nur Notiz", fmt)).toBe("❗ Abweichung: nur Notiz");
  });
  it("joins multi-line input and round-trips", () => {
    const stored = encodeText("Döner gegessen\n\n und Cola ", fmt);
    expect(stored).toBe("Döner gegessen / und Cola");
    const d = mergeDescription(PLAN, "Döner gegessen\n und Cola", fmt);
    const p = parseDescription(d, fmt);
    expect(p.annotation).toBe(stored);
    expect(decodeText(p.annotation!, fmt, true)).toBe("Döner gegessen\nund Cola");
    expect(decodeText(p.annotation!, fmt, false)).toBe(stored);
  });
  it("does not interpret $ patterns in user text", () => {
    expect(mergeDescription("", "kostet $& 5 $1", fmt)).toBe("❗ Abweichung: kostet $& 5 $1");
  });
  it("is idempotent", () => {
    const once = withAnnotation(PLAN, "x", fmt);
    expect(withAnnotation(once, "x", fmt)).toBe(once);
  });
});

describe("normalizeTemplate", () => {
  it("falls back for missing or duplicate placeholder and newlines", () => {
    expect(normalizeTemplate(undefined)).toBe(DEFAULT_TEMPLATE);
    expect(normalizeTemplate("no placeholder")).toBe(DEFAULT_TEMPLATE);
    expect(normalizeTemplate("{text} {text}")).toBe(DEFAULT_TEMPLATE);
    expect(normalizeTemplate("a\n{text}")).toBe(DEFAULT_TEMPLATE);
    expect(normalizeTemplate("📝 {text}")).toBe("📝 {text}");
  });
});
