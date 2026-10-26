import { describe, expect, it } from "vitest";
import { resolveConfig } from "../src/config";
import { buildView, dueDay } from "../src/list";
import type { TodoItem } from "../src/types";

const items: TodoItem[] = [
  { uid: "1", summary: "Mo 26.10. 12:00 Mittag", status: "needs_action", description: "Wraps", due: "2026-10-26T12:00:00+01:00" },
  { uid: "2", summary: "Mo 26.10. 06:00 Frühstück", status: "completed", description: "Oats\n❗ Abweichung: Brötchen", due: "2026-10-26T06:00:00+01:00" },
  { uid: "3", summary: "Di 27.10. 06:00 Frühstück", status: "needs_action", description: "Brötchen", due: "2026-10-27T06:00:00+01:00" },
  { uid: "4", summary: "Ohne Datum", status: "completed", description: "" },
];
const cfg = (o: object = {}) => resolveConfig({ type: "custom:todo-annotate-card", entity: "todo.x", ...o });

describe("buildView", () => {
  it("keeps list order by default", () => {
    const g = buildView(items, cfg());
    expect(g).toHaveLength(1);
    expect(g[0].items.map((v) => v.item.uid)).toEqual(["1", "2", "3", "4"]);
    expect(g[0].items[1].annotation).toBe("Brötchen");
    expect(g[0].items[1].base).toBe("Oats");
  });
  it("sorts by due, undated last", () => {
    expect(buildView(items, cfg({ sort: "due" }))[0].items.map((v) => v.item.uid)).toEqual(["2", "1", "3", "4"]);
  });
  it("sorts alphabetically and annotated first", () => {
    expect(buildView(items, cfg({ sort: "alpha" }))[0].items[0].item.uid).toBe("3");
    expect(buildView(items, cfg({ sort: "annotated_first" }))[0].items[0].item.uid).toBe("2");
  });
  it("hides completed", () => {
    expect(buildView(items, cfg({ show_completed: false }))[0].items.map((v) => v.item.uid)).toEqual(["1", "3"]);
  });
  it("puts completed into their own section", () => {
    const g = buildView(items, cfg({ completed_section: true }));
    expect(g.map((x) => x.kind)).toEqual(["all", "completed"]);
    expect(g[1].items.map((v) => v.item.uid)).toEqual(["2", "4"]);
  });
  it("groups by due day with undated last", () => {
    const g = buildView(items, cfg({ group_by: "due_day", sort: "due" }));
    expect(g.map((x) => x.key)).toEqual([dueDay(items[1].due), dueDay(items[2].due), "nodate"]);
  });
  it("returns no groups for an empty list", () => {
    expect(buildView([], cfg())).toEqual([]);
  });
  it("splits a skip line out of the description only when skip is enabled", () => {
    const its: TodoItem[] = [{ uid: "s", summary: "Lunch", status: "completed", description: "Soup\n⊘ Ausgelassen" }];
    const off = buildView(its, cfg());
    expect(off[0].items[0].skip).toBeNull();
    expect(off[0].items[0].base).toBe("Soup\n⊘ Ausgelassen");
    const on = buildView(its, cfg({ skip: true, skip_format: "⊘ Ausgelassen" }));
    expect(on[0].items[0].skip).toBe("");
    expect(on[0].items[0].base).toBe("Soup");
    expect(on[0].items[0].annotation).toBeNull();
    expect(on[0].items[0].item.summary).toBe("Lunch");
  });
});

describe("resolveConfig", () => {
  it("applies defaults and rejects invalid enum values", () => {
    const c = cfg({ sort: "nope", format: "bad" });
    expect(c.sort).toBe("manual");
    expect(c.format).toBe("❗ Abweichung: {text}");
    expect(c.auto_complete).toBe(true);
    expect(c.marker).toBe("❗");
    expect(c.skip).toBe(false);
    expect(c.skip_format).toBe("");
  });
  it("allows an empty marker", () => {
    expect(cfg({ marker: "" }).marker).toBe("");
  });
});

describe("release metadata", () => {
  it("CARD_VERSION matches package.json", async () => {
    const fs = await import("node:fs");
    const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));
    const src = fs.readFileSync(new URL("../src/todo-annotate-card.ts", import.meta.url), "utf8");
    expect(src).toContain(`CARD_VERSION = "${pkg.version}"`);
  });
});
