import type { EditorKind } from "./edit-session";

const PREFIX = "todo-annotate-card:draft:v1";

/** One unsaved editor buffer per list item and editor kind. Survives reloads. */
export function draftKey(entity: string, uid: string, kind: EditorKind): string {
  return `${PREFIX}:${encodeURIComponent(entity)}:${encodeURIComponent(uid)}:${kind}`;
}

export function readDraft(entity: string, uid: string, kind: EditorKind): string | null {
  try {
    return localStorage.getItem(draftKey(entity, uid, kind));
  } catch {
    return null;
  }
}

export function writeDraft(entity: string, uid: string, kind: EditorKind, text: string): void {
  try {
    localStorage.setItem(draftKey(entity, uid, kind), text);
  } catch {
    /* private mode / quota: the open editor still holds the text */
  }
}

export function clearDraft(entity: string, uid: string, kind: EditorKind): void {
  try {
    localStorage.removeItem(draftKey(entity, uid, kind));
  } catch {
    /* ignore */
  }
}
