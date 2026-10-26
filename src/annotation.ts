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

/** A skipped item is its own marker line. `{text}` is optional (a reason). */
export interface SkipFormat {
  template: string;
  separator: string;
}

export interface ParsedMarkers {
  base: string;
  annotation: string | null;
  /** null = not skipped. "" = skipped with no reason. Otherwise the reason. */
  skip: string | null;
}

/** Storage line when `skip_format` is unset and the UI language is German. */
export const SKIP_FORMAT_DE = "⊘ Ausgelassen";
/** Storage line when `skip_format` is unset and the UI language is not German. */
export const SKIP_FORMAT_EN = "⊘ Skipped";

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

export function defaultSkipFormat(lang: string | undefined): string {
  return (lang ?? "en").toLowerCase().startsWith("de") ? SKIP_FORMAT_DE : SKIP_FORMAT_EN;
}

/** True when the template contains `{text}` exactly once. */
export function templateHasPlaceholder(template: string): boolean {
  return template.split(PLACEHOLDER).length === 2;
}

/**
 * A skip template may omit `{text}` (a flag line such as "⊘ Ausgelassen").
 * More than one `{text}`, or a line break, falls back.
 */
export function normalizeSkipTemplate(template: string | undefined, fallback: string): string {
  if (template === undefined) return fallback;
  const t = template.trim();
  if (!t || /[\r\n]/.test(t) || t.split(PLACEHOLDER).length > 2) return fallback;
  return t;
}

export function effectiveSkipFormat(explicit: string | undefined, lang: string | undefined): string {
  const fallback = defaultSkipFormat(lang);
  return normalizeSkipTemplate(explicit && explicit.trim() ? explicit : undefined, fallback);
}

function placeholderRegex(template: string): RegExp {
  const [pre, post] = template.split(PLACEHOLDER);
  const p = escapeRe(pre.trim()).replace(/\s+/g, "\\s*");
  const s = escapeRe((post ?? "").trim()).replace(/\s+/g, "\\s*");
  return new RegExp(`^\\s*${p}\\s*(.*?)\\s*${s}\\s*$`, "u");
}

function flagRegex(template: string): RegExp {
  const body = escapeRe(template.trim()).replace(/\s+/g, "\\s*");
  return new RegExp(`^\\s*${body}\\s*$`, "u");
}

function matchSkipLine(line: string, fmt: SkipFormat): string | null {
  if (templateHasPlaceholder(fmt.template)) {
    const m = placeholderRegex(fmt.template).exec(line);
    return m ? m[1] : null;
  }
  return flagRegex(fmt.template).test(line) ? "" : null;
}

function skipLine(fmt: SkipFormat, reason: string): string {
  if (!templateHasPlaceholder(fmt.template)) return fmt.template.trim();
  const text = encodeText(reason, { template: fmt.template, separator: fmt.separator });
  return fmt.template.replace(PLACEHOLDER, () => text);
}

/** Splits a description into plan text, annotation, and an optional skip line. */
export function parseMarkers(description: string | null | undefined, ann: AnnotationFormat, skipFmt: SkipFormat | null): ParsedMarkers {
  const raw = description ?? "";
  const lines = splitLines(raw);
  const annRe = lineRegex(ann.template);
  let annIdx = -1;
  let annotation: string | null = null;
  for (let i = lines.length - 1; i >= 0; i--) {
    const m = annRe.exec(lines[i]);
    if (m) {
      annotation = m[1];
      annIdx = i;
      break;
    }
  }
  let skipIdx = -1;
  let skip: string | null = null;
  if (skipFmt) {
    for (let i = lines.length - 1; i >= 0; i--) {
      if (i === annIdx) continue;
      const value = matchSkipLine(lines[i], skipFmt);
      if (value !== null) {
        skip = value;
        skipIdx = i;
        break;
      }
    }
  }
  if (annIdx === -1 && skipIdx === -1) return { base: raw.replace(/\r\n?/g, "\n").trim(), annotation: null, skip: null };
  const rest = lines.filter((_, i) => i !== annIdx && i !== skipIdx);
  return { base: rest.join("\n").trim(), annotation, skip };
}

/**
 * Writes the plan, at most one annotation line, and at most one skip line.
 * `skip === null` removes the skip line. A string (including "") keeps it.
 * Pass `skipFmt === null` when the third checkbox is off.
 */
export function mergeMarkers(
  base: string,
  annotation: string | null,
  skip: string | null,
  ann: AnnotationFormat,
  skipFmt: SkipFormat | null,
): string {
  const lines: string[] = [];
  const b = base.replace(/\r\n?/g, "\n").trim();
  if (b) lines.push(b);
  if (annotation !== null) {
    const text = encodeText(annotation, ann);
    if (text) lines.push(normalizeTemplate(ann.template).replace(PLACEHOLDER, () => text));
  }
  if (skip !== null && skipFmt) lines.push(skipLine(skipFmt, skip));
  return lines.join("\n");
}
