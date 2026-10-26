import { decodeText, mergeMarkers, templateHasPlaceholder, type AnnotationFormat, type SkipFormat } from "./annotation";

export type EditorKind = "annotation" | "skip";

export interface EditorState {
  uid: string;
  kind: EditorKind;
  text: string;
  isNew: boolean;
}

export interface RowState {
  uid: string;
  status: "needs_action" | "completed";
  base: string;
  annotation: string | null;
  skip: string | null;
}

export interface SessionPolicy {
  autoComplete: boolean;
  onRemove: "keep" | "reopen";
  annotation: AnnotationFormat;
  /** null when the third checkbox is off. */
  skip: SkipFormat | null;
  multiline: boolean;
}

export interface DraftStore {
  /** null when no draft is stored. An empty string is a stored draft. */
  get(uid: string, kind: EditorKind): string | null;
}

export interface ItemUpdate {
  uid: string;
  status?: "needs_action" | "completed";
  description?: string;
  /** Applied only after this update succeeds. */
  clearDrafts: EditorKind[];
}

export interface SessionPlan {
  editor: EditorState | null;
  updates: ItemUpdate[];
  /** Written immediately (typing, or Cancel). */
  remember?: { uid: string; kind: EditorKind; text: string };
  /** Drop a draft immediately. Used when an empty implicit close should reveal the stored note again. */
  forgetDraft?: { uid: string; kind: EditorKind };
  /** Skipping would delete an existing note; the caller must ask first. */
  confirmRemoveAnnotation?: { text: string };
}

export type SessionGesture =
  | { type: "input"; text: string }
  | { type: "cancel" }
  | { type: "save"; row: RowState; confirmed?: boolean }
  | { type: "remove"; row: RowState }
  | { type: "annotate"; row: RowState }
  | { type: "done"; row: RowState }
  | { type: "skip"; row: RowState; confirmed?: boolean }
  | { type: "edit-skip"; row: RowState };

const trimmed = (s: string | null | undefined): string => (s ?? "").trim();

function preservedAnnotation(row: RowState, policy: SessionPolicy): string | null {
  if (row.annotation === null) return null;
  return decodeText(row.annotation, policy.annotation, true);
}

function preservedSkip(row: RowState, policy: SessionPolicy): string | null {
  if (row.skip === null || !policy.skip) return null;
  if (!templateHasPlaceholder(policy.skip.template)) return "";
  return decodeText(row.skip, { template: policy.skip.template, separator: policy.skip.separator }, true);
}

function annotationUpdate(row: RowState, text: string, policy: SessionPolicy, status?: RowState["status"]): ItemUpdate {
  const description = mergeMarkers(row.base, text, null, policy.annotation, policy.skip);
  const update: ItemUpdate = { uid: row.uid, description, clearDrafts: ["annotation"] };
  if (status) update.status = status;
  else if (policy.autoComplete && row.status !== "completed") update.status = "completed";
  return update;
}

function removeAnnotationUpdate(row: RowState, policy: SessionPolicy): ItemUpdate {
  const description = mergeMarkers(row.base, null, preservedSkip(row, policy), policy.annotation, policy.skip);
  const update: ItemUpdate = { uid: row.uid, description, clearDrafts: ["annotation"] };
  if (policy.onRemove === "reopen" && row.status === "completed") update.status = "needs_action";
  return update;
}

function skipUpdate(row: RowState, reason: string, policy: SessionPolicy): ItemUpdate {
  const description = mergeMarkers(row.base, null, reason, policy.annotation, policy.skip);
  return { uid: row.uid, description, status: "completed", clearDrafts: ["skip", "annotation"] };
}

function unskipUpdate(row: RowState, policy: SessionPolicy): ItemUpdate {
  const description = mergeMarkers(row.base, preservedAnnotation(row, policy), null, policy.annotation, policy.skip);
  return { uid: row.uid, description, clearDrafts: ["skip"] };
}

/** Unchecking done on a skipped item: drop the skip line, mark not done. */
function reopenFromSkip(row: RowState, policy: SessionPolicy, annotation: string | null): ItemUpdate {
  const description = mergeMarkers(row.base, annotation, null, policy.annotation, policy.skip);
  return { uid: row.uid, description, status: "needs_action", clearDrafts: annotation && annotation.trim() ? ["skip", "annotation"] : ["skip"] };
}

function flush(editor: EditorState, row: RowState, policy: SessionPolicy): ItemUpdate | null {
  if (!editor.text.trim()) return null;
  if (editor.kind === "annotation") return annotationUpdate(row, editor.text, policy);
  if (!policy.skip) return null;
  return skipUpdate(row, editor.text, policy);
}

function openEditor(row: RowState, kind: EditorKind, policy: SessionPolicy, drafts: DraftStore): EditorState {
  const draft = drafts.get(row.uid, kind);
  let stored = "";
  let isNew = true;
  if (kind === "annotation") {
    isNew = row.annotation === null;
    stored = row.annotation === null ? "" : decodeText(row.annotation, policy.annotation, policy.multiline);
  } else {
    isNew = row.skip === null;
    if (row.skip !== null && policy.skip && templateHasPlaceholder(policy.skip.template)) {
      stored = decodeText(row.skip, { template: policy.skip.template, separator: policy.skip.separator }, policy.multiline);
    }
  }
  return { uid: row.uid, kind, text: draft !== null ? draft : stored, isNew };
}

function liveAnnotationText(row: RowState, editor: EditorState | null): string {
  if (editor && editor.uid === row.uid && editor.kind === "annotation" && editor.text.trim()) return editor.text.trim();
  return trimmed(row.annotation);
}

/**
 * Decides what an editor gesture does. Non-empty typed text is saved for the
 * annotation checkbox, the done checkbox, and when another item's editor opens.
 * Cancel does not write to Home Assistant; the caller stores `remember` as a draft.
 */
export function applyGesture(
  editor: EditorState | null,
  editorRow: RowState | null,
  gesture: SessionGesture,
  policy: SessionPolicy,
  drafts: DraftStore,
): SessionPlan {
  switch (gesture.type) {
    case "input": {
      if (!editor) return { editor: null, updates: [] };
      return {
        editor: { ...editor, text: gesture.text },
        updates: [],
        remember: { uid: editor.uid, kind: editor.kind, text: gesture.text },
      };
    }
    case "cancel": {
      if (!editor) return { editor: null, updates: [] };
      return { editor: null, updates: [], remember: { uid: editor.uid, kind: editor.kind, text: editor.text } };
    }
    case "save":
      return save(editor, gesture.row, policy, gesture.confirmed === true);
    case "remove":
      return remove(editor, gesture.row, policy);
    case "annotate":
      return annotate(editor, editorRow, gesture.row, policy, drafts);
    case "done":
      return done(editor, editorRow, gesture.row, policy);
    case "skip":
      return skip(editor, editorRow, gesture.row, policy, drafts, gesture.confirmed === true);
    case "edit-skip":
      return editSkip(editor, editorRow, gesture.row, policy, drafts);
    default:
      return { editor, updates: [] };
  }
}

function save(editor: EditorState | null, row: RowState, policy: SessionPolicy, confirmed: boolean): SessionPlan {
  if (!editor || editor.uid !== row.uid) return { editor, updates: [] };
  if (editor.kind === "annotation") {
    if (!editor.text.trim()) {
      if (row.annotation !== null) return { editor: null, updates: [removeAnnotationUpdate(row, policy)] };
      return { editor: null, updates: [], forgetDraft: { uid: editor.uid, kind: "annotation" } };
    }
    return { editor: null, updates: [annotationUpdate(row, editor.text, policy)] };
  }
  if (!policy.skip) return { editor, updates: [] };
  const ann = trimmed(row.annotation);
  if (ann && !confirmed) return { editor, updates: [], confirmRemoveAnnotation: { text: ann } };
  return { editor: null, updates: [skipUpdate(row, editor.text, policy)] };
}

function remove(editor: EditorState | null, row: RowState, policy: SessionPolicy): SessionPlan {
  if (!editor || editor.uid !== row.uid) return { editor, updates: [] };
  if (editor.kind === "skip") {
    if (row.skip === null) return { editor: null, updates: [], forgetDraft: { uid: row.uid, kind: "skip" } };
    return { editor: null, updates: [unskipUpdate(row, policy)] };
  }
  if (row.annotation === null && !editor.text.trim()) return { editor: null, updates: [], forgetDraft: { uid: row.uid, kind: "annotation" } };
  return { editor: null, updates: [removeAnnotationUpdate(row, policy)] };
}

function annotate(editor: EditorState | null, editorRow: RowState | null, row: RowState, policy: SessionPolicy, drafts: DraftStore): SessionPlan {
  const same = editor && editor.uid === row.uid && editor.kind === "annotation";
  if (same && editor) {
    // (A) Tapping the annotation checkbox again confirms non-empty text.
    if (editor.text.trim()) return { editor: null, updates: [annotationUpdate(row, editor.text, policy)] };
    return { editor: null, updates: [], forgetDraft: { uid: row.uid, kind: "annotation" } };
  }
  if (editor && editor.text.trim() && !editorRow) return { editor, updates: [] };
  const updates: ItemUpdate[] = [];
  if (editor && editor.text.trim() && editorRow) {
    const flushed = flush(editor, editorRow, policy);
    if (flushed) updates.push(flushed);
  }
  return { editor: openEditor(row, "annotation", policy, drafts), updates };
}

function done(editor: EditorState | null, editorRow: RowState | null, row: RowState, policy: SessionPolicy): SessionPlan {
  const next: RowState["status"] = row.status === "completed" ? "needs_action" : "completed";
  const same = editor && editor.uid === row.uid ? editor : null;

  if (same && same.kind === "annotation" && same.text.trim()) {
    // (C) Done while typing sends the note and the toggled status together.
    return { editor: null, updates: [annotationUpdate(row, same.text, policy, next)] };
  }
  if (same && same.kind === "skip" && next === "needs_action") {
    return {
      editor: null,
      updates: [reopenFromSkip(row, policy, preservedAnnotation(row, policy))],
      remember: { uid: row.uid, kind: "skip", text: same.text },
    };
  }
  if (same && same.kind === "skip" && same.text.trim()) {
    return { editor: null, updates: [skipUpdate(row, same.text, policy)] };
  }

  if (editor && editor.text.trim() && editor.uid !== row.uid && !editorRow) return { editor, updates: [] };

  const updates: ItemUpdate[] = [];
  let nextEditor = same && !same.text.trim() ? same : editor && editor.uid !== row.uid ? editor : null;
  if (editor && editor.uid !== row.uid && editor.text.trim() && editorRow) {
    const flushed = flush(editor, editorRow, policy);
    if (flushed) updates.push(flushed);
    nextEditor = null;
  }
  if (next === "needs_action" && row.skip !== null) updates.push(reopenFromSkip(row, policy, preservedAnnotation(row, policy)));
  else updates.push({ uid: row.uid, status: next, clearDrafts: [] });
  return { editor: nextEditor, updates };
}

function skip(
  editor: EditorState | null,
  editorRow: RowState | null,
  row: RowState,
  policy: SessionPolicy,
  drafts: DraftStore,
  confirmed: boolean,
): SessionPlan {
  if (!policy.skip) return { editor, updates: [] };
  const sameSkip = editor && editor.uid === row.uid && editor.kind === "skip" ? editor : null;
  if (sameSkip) {
    const needsText = templateHasPlaceholder(policy.skip.template);
    if (needsText && !sameSkip.text.trim()) return { editor: null, updates: [], forgetDraft: { uid: row.uid, kind: "skip" } };
    const ann = trimmed(row.annotation);
    if (ann && !confirmed) return { editor, updates: [], confirmRemoveAnnotation: { text: ann } };
    return { editor: null, updates: [skipUpdate(row, sameSkip.text, policy)] };
  }

  if (row.skip !== null) {
    if (editor && editor.uid !== row.uid && editor.text.trim() && !editorRow) return { editor, updates: [] };
    const updates: ItemUpdate[] = [];
    let nextEditor: EditorState | null = editor && editor.uid !== row.uid ? editor : null;
    if (editor && editor.uid === row.uid && editor.kind === "annotation" && editor.text.trim()) {
      updates.push(annotationUpdate(row, editor.text, policy));
      return { editor: null, updates };
    }
    if (editor && editor.uid !== row.uid && editor.text.trim() && editorRow) {
      const flushed = flush(editor, editorRow, policy);
      if (flushed) updates.push(flushed);
      nextEditor = null;
    }
    updates.push(unskipUpdate(row, policy));
    return { editor: nextEditor, updates };
  }

  const remember =
    editor && editor.uid === row.uid && editor.kind === "annotation"
      ? { uid: row.uid, kind: "annotation" as const, text: editor.text }
      : undefined;

  // A reason is collected first. The note is removed only when the skip line is written,
  // and that write asks for confirmation if a note exists.
  if (templateHasPlaceholder(policy.skip.template)) {
    return { editor: openEditor(row, "skip", policy, drafts), updates: [], remember };
  }

  const ann = liveAnnotationText(row, editor);
  if (ann && !confirmed) return { editor, updates: [], confirmRemoveAnnotation: { text: ann } };

  if (editor && editor.uid !== row.uid && editor.text.trim() && !editorRow) return { editor, updates: [] };
  const updates: ItemUpdate[] = [];
  if (editor && editor.uid !== row.uid && editor.text.trim() && editorRow) {
    const flushed = flush(editor, editorRow, policy);
    if (flushed) updates.push(flushed);
  }
  updates.push(skipUpdate(row, "", policy));
  return { editor: null, updates, remember };
}

function editSkip(editor: EditorState | null, editorRow: RowState | null, row: RowState, policy: SessionPolicy, drafts: DraftStore): SessionPlan {
  if (!policy.skip) return { editor, updates: [] };
  if (editor && editor.uid === row.uid && editor.kind === "skip") return { editor, updates: [] };
  if (editor && editor.text.trim() && !editorRow) return { editor, updates: [] };
  const updates: ItemUpdate[] = [];
  if (editor && editor.text.trim() && editorRow) {
    const flushed = flush(editor, editorRow, policy);
    if (flushed) updates.push(flushed);
  }
  return { editor: openEditor(row, "skip", policy, drafts), updates };
}
