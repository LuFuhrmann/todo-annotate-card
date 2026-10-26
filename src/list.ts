import { parseMarkers, type AnnotationFormat, type SkipFormat } from "./annotation";
import type { ResolvedConfig } from "./config";
import type { TodoItem } from "./types";

export interface ViewItem {
  item: TodoItem;
  base: string;
  annotation: string | null;
  /** null when the item is not skipped (or the third checkbox is off). */
  skip: string | null;
}
export interface ViewGroup {
  key: string;
  /** Date key (YYYY-MM-DD), "" for "no date", "completed" for the completed section, "all" otherwise. */
  kind: "all" | "day" | "nodate" | "completed";
  items: ViewItem[];
}

/** Local calendar day of a due value ("YYYY-MM-DD" or an ISO datetime). */
export function dueDay(due: string | null | undefined): string {
  if (!due) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(due)) return due;
  const d = new Date(due);
  if (isNaN(d.getTime())) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const dueValue = (due: string | null | undefined): number => {
  if (!due) return Number.POSITIVE_INFINITY;
  const t = /^\d{4}-\d{2}-\d{2}$/.test(due) ? new Date(`${due}T00:00:00`).getTime() : new Date(due).getTime();
  return isNaN(t) ? Number.POSITIVE_INFINITY : t;
};

export function buildView(items: TodoItem[], cfg: ResolvedConfig): ViewGroup[] {
  const fmt: AnnotationFormat = { template: cfg.format, separator: cfg.separator };
  const skipFmt: SkipFormat | null = cfg.skip && cfg.skip_format ? { template: cfg.skip_format, separator: cfg.separator } : null;
  let list: ViewItem[] = items.map((item) => ({ item, ...parseMarkers(item.description, fmt, skipFmt) }));
  if (!cfg.show_completed) list = list.filter((v) => v.item.status !== "completed");

  const order = new Map(items.map((it, i) => [it.uid, i]));
  const cmp: Record<ResolvedConfig["sort"], (a: ViewItem, b: ViewItem) => number> = {
    manual: (a, b) => order.get(a.item.uid)! - order.get(b.item.uid)!,
    alpha: (a, b) => a.item.summary.localeCompare(b.item.summary),
    due: (a, b) => dueValue(a.item.due) - dueValue(b.item.due) || order.get(a.item.uid)! - order.get(b.item.uid)!,
    annotated_first: (a, b) =>
      Number(b.annotation !== null) - Number(a.annotation !== null) || order.get(a.item.uid)! - order.get(b.item.uid)!,
  };
  list = [...list].sort(cmp[cfg.sort]);

  let completed: ViewItem[] = [];
  if (cfg.completed_section) {
    completed = list.filter((v) => v.item.status === "completed");
    list = list.filter((v) => v.item.status !== "completed");
  }

  const groups: ViewGroup[] = [];
  if (cfg.group_by === "due_day") {
    const byDay = new Map<string, ViewItem[]>();
    for (const v of list) {
      const k = dueDay(v.item.due);
      if (!byDay.has(k)) byDay.set(k, []);
      byDay.get(k)!.push(v);
    }
    const keys = [...byDay.keys()].sort((a, b) => (a === "" ? 1 : b === "" ? -1 : a.localeCompare(b)));
    for (const k of keys) groups.push({ key: k || "nodate", kind: k ? "day" : "nodate", items: byDay.get(k)! });
  } else if (list.length) {
    groups.push({ key: "all", kind: "all", items: list });
  }
  if (completed.length) groups.push({ key: "completed", kind: "completed", items: completed });
  return groups;
}
