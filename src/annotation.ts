/**
 * Pure helpers for storing an annotation as one formatted line inside a to-do
 * item's description. The summary is never touched.
 *
 * Format: a template containing `{text}`, e.g. "❗ Abweichung: {text}".
 * Multi-line input is stored on one line, joined with `separator` (default " / ").
 */

export interface AnnotationFormat {
  /** Template containing exactly one `{text}` placeholder. */
  template: string;
  /** Joins multiple input lines into the single stored line. */
  separator: string;
}

export interface ParsedDescription {
  /** Description without the annotation line (the "plan"/original text). */
  base: string;
  /** Annotation text, or null if the item is not annotated. */
  annotation: string | null;
}

export const DEFAULT_TEMPLATE = "❗ Abweichung: {text}";
export const DEFAULT_SEPARATOR = " / ";
const PLACEHOLDER = "{text}";

const escapeRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Returns a valid template, falling back to the default for bad input. */
export function normalizeTemplate(template: string | undefined): string {
  if (!template || template.split(PLACEHOLDER).length !== 2) return DEFAULT_TEMPLATE;
  if (/[\r\n]/.test(template)) return DEFAULT_TEMPLATE;
  return template;
}

function lineRegex(template: string): RegExp {
  const [pre, post] = normalizeTemplate(template).split(PLACEHOLDER);
  // Tolerate surrounding whitespace and whitespace differences around the prefix/suffix.
  const p = escapeRe(pre.trim()).replace(/\s+/g, "\\s*");
  const s = escapeRe(post.trim()).replace(/\s+/g, "\\s*");
  return new RegExp(`^\\s*${p}\\s*(.*?)\\s*${s}\\s*$`, "u");
}

const splitLines = (s: string): string[] => s.replace(/\r\n?/g, "\n").split("\n");

/** Splits a description into the base text and the annotation (last matching line wins). */
export function parseDescription(description: string | null | undefined, fmt: AnnotationFormat): ParsedDescription {
  const lines = splitLines(description ?? "");
  const re = lineRegex(fmt.template);
  let annotation: string | null = null;
  let idx = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    const m = re.exec(lines[i]);
    if (m) {
      annotation = m[1];
      idx = i;
      break;
    }
  }
  if (idx === -1) return { base: (description ?? "").replace(/\r\n?/g, "\n").trim(), annotation: null };
  const rest = lines.filter((_, i) => i !== idx);
  return { base: rest.join("\n").trim(), annotation: annotation ?? "" };
}

/** Turns user input (possibly multi-line) into the single stored text. */
export function encodeText(input: string, fmt: AnnotationFormat): string {
  return splitLines(input)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .join(fmt.separator);
}

/** Reverses encodeText for editing in a multi-line field. */
export function decodeText(stored: string, fmt: AnnotationFormat, multiline: boolean): string {
  if (!multiline || !fmt.separator) return stored;
  return stored.split(fmt.separator).join("\n");
}

/** Builds the new description. Empty/blank annotation removes the line. */
export function mergeDescription(base: string, annotation: string | null, fmt: AnnotationFormat): string {
  const b = base.replace(/\r\n?/g, "\n").trim();
  const text = annotation === null ? "" : encodeText(annotation, fmt);
  if (!text) return b;
  const line = normalizeTemplate(fmt.template).replace(PLACEHOLDER, () => text);
  return b ? `${b}\n${line}` : line;
}

/** Convenience: set/replace/remove the annotation of an existing description. */
export function withAnnotation(description: string | null | undefined, annotation: string | null, fmt: AnnotationFormat): string {
  return mergeDescription(parseDescription(description, fmt).base, annotation, fmt);
}
