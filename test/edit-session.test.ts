import { describe, expect, it } from "vitest";
import { clearDraft, draftKey, readDraft, writeDraft } from "../src/drafts";
import { applyGesture, type DraftStore, type EditorState, type RowState, type SessionPolicy } from "../src/edit-session";
import { localizer } from "../src/localize";

const policy: SessionPolicy = {
  autoComplete: true,
  onRemove: "keep",
  annotation: { template: "❗ Abweichung: {text}", separator: " / " },
  skip: null,
  multiline: true,
};

class MemDrafts implements DraftStore {
  private m = new Map<string, string>();
  private key(uid: string, kind: "annotation" | "skip") {
    return `${uid}:${kind}`;
  }
  get(uid: string, kind: "annotation" | "skip"): string | null {
    const k = this.key(uid, kind);
    return this.m.has(k) ? this.m.get(k)! : null;
  }
  set(uid: string, kind: "annotation" | "skip", text: string) {
    this.m.set(this.key(uid, kind), text);
  }
  clear(uid: string, kind: "annotation" | "skip") {
    this.m.delete(this.key(uid, kind));
  }
}

const row = (p: Partial<RowState> = {}): RowState => ({
  uid: "a",
  status: "needs_action",
  base: "Oats",
  annotation: null,
  skip: null,
  ...p,
});

function typeNote(text: string, drafts = new MemDrafts(), current: RowState = row()) {
  const opened = applyGesture(null, null, { type: "annotate", row: current }, policy, drafts);
  const editor = opened.editor as EditorState;
  const typed = applyGesture(editor, current, { type: "input", text }, policy, drafts);
  if (typed.remember) drafts.set(typed.remember.uid, typed.remember.kind, typed.remember.text);
  return { editor: typed.editor as EditorState, drafts, row: current };
}

describe("regression: unsaved annotation text", () => {
  it("A: tapping the annotation checkbox again saves the typed text", () => {
    const { editor, drafts, row: current } = typeNote("Pizza with colleagues");
    const plan = applyGesture(editor, current, { type: "annotate", row: current }, policy, drafts);
    expect(plan.editor).toBeNull();
    expect(plan.updates).toHaveLength(1);
    expect(plan.updates[0].description).toBe("Oats\n❗ Abweichung: Pizza with colleagues");
    expect(plan.updates[0].status).toBe("completed");
    expect(plan.updates[0].clearDrafts).toContain("annotation");
  });

  it("B: opening another item's editor saves the typed text first", () => {
    const { editor, drafts, row: current } = typeNote("Pizza");
    const other = row({ uid: "b", base: "Soup" });
    const plan = applyGesture(editor, current, { type: "annotate", row: other }, policy, drafts);
    expect(plan.updates.map((u) => u.uid)).toEqual(["a"]);
    expect(plan.updates[0].description).toBe("Oats\n❗ Abweichung: Pizza");
    expect(plan.editor).toMatchObject({ uid: "b", kind: "annotation", text: "" });
  });

  it("C: tapping done while typing sends the text and the status", () => {
    const { editor, drafts, row: current } = typeNote("Pizza");
    const plan = applyGesture(editor, current, { type: "done", row: current }, policy, drafts);
    expect(plan.updates).toHaveLength(1);
    expect(plan.updates[0].description).toBe("Oats\n❗ Abweichung: Pizza");
    expect(plan.updates[0].status).toBe("completed");
    expect(plan.editor).toBeNull();
  });

  it("C: unchecking done while typing still keeps the text and reopens the item", () => {
    const current = row({ status: "completed" });
    const { editor, drafts } = typeNote("Pizza", new MemDrafts(), current);
    const plan = applyGesture(editor, current, { type: "done", row: current }, policy, drafts);
    expect(plan.updates[0].description).toBe("Oats\n❗ Abweichung: Pizza");
    expect(plan.updates[0].status).toBe("needs_action");
  });

  it("does not write an empty editor when the checkbox is tapped", () => {
    const current = row();
    const opened = applyGesture(null, null, { type: "annotate", row: current }, policy, new MemDrafts());
    const plan = applyGesture(opened.editor, current, { type: "annotate", row: current }, policy, new MemDrafts());
    expect(plan.updates).toEqual([]);
    expect(plan.editor).toBeNull();
  });

  it("Cancel does not write to Home Assistant and restores the draft next time", () => {
    const drafts = new MemDrafts();
    const current = row();
    const { editor } = typeNote("Pizza", drafts, current);
    const cancelled = applyGesture(editor, current, { type: "cancel" }, policy, drafts);
    expect(cancelled.updates).toEqual([]);
    expect(cancelled.editor).toBeNull();
    expect(cancelled.remember).toEqual({ uid: "a", kind: "annotation", text: "Pizza" });
    drafts.set("a", "annotation", cancelled.remember!.text);
    const again = applyGesture(null, null, { type: "annotate", row: current }, policy, drafts);
    expect(again.editor?.text).toBe("Pizza");
    expect(again.updates).toEqual([]);
  });

  it("a successful save clears the draft so the stored note is what comes back", () => {
    const drafts = new MemDrafts();
    const current = row();
    const first = typeNote("AAA", drafts, current);
    const saved = applyGesture(first.editor, current, { type: "save", row: current }, policy, drafts);
    for (const kind of saved.updates[0].clearDrafts) drafts.clear("a", kind);
    const stored = row({ status: "completed", annotation: "BBB", base: "Oats" });
    drafts.set("a", "annotation", "AAA");
    for (const kind of saved.updates[0].clearDrafts) drafts.clear(stored.uid, kind);
    const reopened = applyGesture(null, null, { type: "annotate", row: stored }, policy, drafts);
    expect(reopened.editor?.text).toBe("BBB");
  });
});

describe("skipped checkbox", () => {
  const skipPolicy: SessionPolicy = { ...policy, skip: { template: "⊘ Ausgelassen", separator: " / " } };
  const reasonPolicy: SessionPolicy = { ...policy, skip: { template: "⊘ Ausgelassen: {text}", separator: " / " } };

  it("sets the flag line and marks the item done", () => {
    const current = row();
    const plan = applyGesture(null, null, { type: "skip", row: current }, skipPolicy, new MemDrafts());
    expect(plan.confirmRemoveAnnotation).toBeUndefined();
    expect(plan.updates[0].description).toBe("Oats\n⊘ Ausgelassen");
    expect(plan.updates[0].status).toBe("completed");
    expect(plan.editor).toBeNull();
  });

  it("asks before replacing an existing note, then removes that note", () => {
    const current = row({ annotation: "Pizza", status: "completed" });
    const ask = applyGesture(null, null, { type: "skip", row: current }, skipPolicy, new MemDrafts());
    expect(ask.updates).toEqual([]);
    expect(ask.confirmRemoveAnnotation?.text).toBe("Pizza");
    const plan = applyGesture(null, null, { type: "skip", row: current, confirmed: true }, skipPolicy, new MemDrafts());
    expect(plan.updates[0].description).toBe("Oats\n⊘ Ausgelassen");
    expect(plan.updates[0].status).toBe("completed");
    expect(plan.updates[0].description).not.toContain("Abweichung");
  });

  it("asks for a reason before confirming removal of a note", () => {
    const current = row({ annotation: "Pizza", status: "completed" });
    const opened = applyGesture(null, null, { type: "skip", row: current }, reasonPolicy, new MemDrafts());
    expect(opened.confirmRemoveAnnotation).toBeUndefined();
    expect(opened.editor).toMatchObject({ kind: "skip" });
    const typed = applyGesture(opened.editor, current, { type: "input", text: "keine Zeit" }, reasonPolicy, new MemDrafts());
    const ask = applyGesture(typed.editor, current, { type: "save", row: current }, reasonPolicy, new MemDrafts());
    expect(ask.updates).toEqual([]);
    expect(ask.confirmRemoveAnnotation?.text).toBe("Pizza");
    const saved = applyGesture(typed.editor, current, { type: "save", row: current, confirmed: true }, reasonPolicy, new MemDrafts());
    expect(saved.updates[0].description).toBe("Oats\n⊘ Ausgelassen: keine Zeit");
    expect(saved.updates[0].description).not.toContain("Pizza");
  });

  it("asks for a reason when the format contains {text}", () => {
    const current = row();
    const opened = applyGesture(null, null, { type: "skip", row: current }, reasonPolicy, new MemDrafts());
    expect(opened.updates).toEqual([]);
    expect(opened.editor).toMatchObject({ kind: "skip", isNew: true, text: "" });
    const typed = applyGesture(opened.editor, current, { type: "input", text: "keine Zeit" }, reasonPolicy, new MemDrafts());
    const saved = applyGesture(typed.editor, current, { type: "skip", row: current }, reasonPolicy, new MemDrafts());
    expect(saved.updates[0].description).toBe("Oats\n⊘ Ausgelassen: keine Zeit");
    expect(saved.updates[0].status).toBe("completed");
  });

  it("unchecking skip leaves the item done", () => {
    const current = row({ status: "completed", skip: "" });
    const plan = applyGesture(null, null, { type: "skip", row: current }, skipPolicy, new MemDrafts());
    expect(plan.updates[0].description).toBe("Oats");
    expect(plan.updates[0].status).toBeUndefined();
  });

  it("unchecking done removes the skip line and reopens the item", () => {
    const current = row({ status: "completed", skip: "" });
    const plan = applyGesture(null, null, { type: "done", row: current }, skipPolicy, new MemDrafts());
    expect(plan.updates[0].description).toBe("Oats");
    expect(plan.updates[0].status).toBe("needs_action");
  });

  it("saving a note removes the skip line", () => {
    const current = row({ status: "completed", skip: "" });
    const { editor } = typeNote("Pizza", new MemDrafts(), current);
    const plan = applyGesture(editor, current, { type: "save", row: current }, skipPolicy, new MemDrafts());
    expect(plan.updates[0].description).toBe("Oats\n❗ Abweichung: Pizza");
    expect(plan.updates[0].description).not.toContain("⊘");
  });
});

describe("draft storage", () => {
  it("round-trips per entity and item and clears after a successful save", () => {
    const store = new Map<string, string>();
    const memory = {
      getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
      setItem: (k: string, v: string) => store.set(k, v),
      removeItem: (k: string) => store.delete(k),
    };
    Object.defineProperty(globalThis, "localStorage", { value: memory, configurable: true });
    expect(draftKey("todo.meal_plan", "a b", "annotation")).toBe(
      "todo-annotate-card:draft:v1:todo.meal_plan:a%20b:annotation",
    );
    expect(readDraft("todo.meal_plan", "a b", "annotation")).toBeNull();
    writeDraft("todo.meal_plan", "a b", "annotation", "Pizza");
    expect(readDraft("todo.meal_plan", "a b", "annotation")).toBe("Pizza");
    expect(readDraft("todo.other", "a b", "annotation")).toBeNull();
    clearDraft("todo.meal_plan", "a b", "annotation");
    expect(readDraft("todo.meal_plan", "a b", "annotation")).toBeNull();
  });
});

describe("unsaved hint copy", () => {
  it("uses the required English and German strings", () => {
    expect(localizer("en")("unsaved")).toBe("Not saved yet");
    expect(localizer("de")("unsaved")).toBe("Noch nicht gespeichert");
    expect(localizer("de")("skipped")).toBe("Ausgelassen");
    expect(localizer("en")("skipped")).toBe("Skipped");
  });
});
