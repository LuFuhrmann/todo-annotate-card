import { DEFAULT_SEPARATOR, DEFAULT_TEMPLATE, normalizeTemplate } from "./annotation";
import type { TodoAnnotateCardConfig } from "./types";

export type ResolvedConfig = Required<Omit<TodoAnnotateCardConfig, "title" | "annotation_label" | "skip_label">> & {
  title?: string;
  annotation_label?: string;
  skip_label?: string;
};

export const DEFAULTS = {
  annotation_icon: "mdi:alert-circle-outline",
  marker: "❗",
  format: DEFAULT_TEMPLATE,
  separator: DEFAULT_SEPARATOR,
  auto_complete: true,
  on_remove: "keep",
  multiline: true,
  show_completed: true,
  completed_section: false,
  sort: "manual",
  group_by: "none",
  description: "always",
  show_due: true,
  compact: false,
  show_header: true,
  skip: false,
  skip_format: "",
} as const;

const oneOf = <T extends string>(v: unknown, allowed: readonly T[], d: T): T =>
  (allowed as readonly unknown[]).includes(v) ? (v as T) : d;

export function resolveConfig(c: TodoAnnotateCardConfig): ResolvedConfig {
  return {
    type: c.type,
    entity: c.entity,
    title: c.title,
    annotation_label: c.annotation_label,
    annotation_icon: c.annotation_icon || DEFAULTS.annotation_icon,
    marker: c.marker ?? DEFAULTS.marker,
    format: normalizeTemplate(c.format),
    separator: typeof c.separator === "string" && c.separator.length > 0 ? c.separator : DEFAULTS.separator,
    auto_complete: c.auto_complete ?? DEFAULTS.auto_complete,
    on_remove: oneOf(c.on_remove, ["keep", "reopen"], DEFAULTS.on_remove),
    multiline: c.multiline ?? DEFAULTS.multiline,
    show_completed: c.show_completed ?? DEFAULTS.show_completed,
    completed_section: c.completed_section ?? DEFAULTS.completed_section,
    sort: oneOf(c.sort, ["manual", "alpha", "due", "annotated_first"], DEFAULTS.sort),
    group_by: oneOf(c.group_by, ["none", "due_day"], DEFAULTS.group_by),
    description: oneOf(c.description, ["always", "collapsed", "hidden"], DEFAULTS.description),
    show_due: c.show_due ?? DEFAULTS.show_due,
    compact: c.compact ?? DEFAULTS.compact,
    show_header: c.show_header ?? DEFAULTS.show_header,
    skip: c.skip ?? DEFAULTS.skip,
    skip_label: c.skip_label,
    skip_format: typeof c.skip_format === "string" ? c.skip_format : DEFAULTS.skip_format,
  };
}
