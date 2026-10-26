import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { DEFAULT_TEMPLATE, decodeText, mergeDescription, type AnnotationFormat } from "./annotation";
import { resolveConfig, type ResolvedConfig } from "./config";
import { buildView, dueDay, type ViewItem } from "./list";
import { localizer, type Localizer } from "./localize";
import { TodoFeature, type HomeAssistant, type TodoAnnotateCardConfig, type TodoItem } from "./types";
import "./todo-annotate-card-editor";

export const CARD_VERSION = "1.0.0";
const TAG = "todo-annotate-card";

interface EditState {
  uid: string;
  text: string;
  isNew: boolean;
}

export class TodoAnnotateCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _items: { state: true },
    _edit: { state: true },
    _expanded: { state: true },
    _busy: { state: true },
    _error: { state: true },
  };

  hass?: HomeAssistant;
  private _config?: ResolvedConfig;
  private _items?: TodoItem[];
  private _edit?: EditState;
  private _expanded = new Set<string>();
  private _busy = new Set<string>();
  private _error?: string;
  private _unsub?: Promise<() => unknown>;
  private _subscribedTo?: string;

  static getConfigElement(): HTMLElement {
    return document.createElement(`${TAG}-editor`);
  }

  static getStubConfig(hass?: HomeAssistant): Partial<TodoAnnotateCardConfig> {
    const entity = Object.keys(hass?.states ?? {}).find((e) => e.startsWith("todo.")) ?? "";
    return { entity };
  }

  setConfig(config: TodoAnnotateCardConfig): void {
    if (!config || typeof config !== "object") throw new Error("Invalid configuration");
    if (config.entity && !String(config.entity).startsWith("todo.")) {
      throw new Error("entity must be a to-do list (todo.*)");
    }
    const next = resolveConfig(config);
    if (this._config?.entity !== next.entity) this._items = undefined;
    this._config = next;
  }

  getCardSize(): number {
    return 2 + Math.min(this._items?.length ?? 3, 10);
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" };
  }

  private get _t(): Localizer {
    return localizer(this.hass?.locale?.language ?? this.hass?.language);
  }

  private get _fmt(): AnnotationFormat {
    return { template: this._config?.format ?? DEFAULT_TEMPLATE, separator: this._config?.separator ?? " / " };
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._subscribe();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubscribe();
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("hass") || changed.has("_config")) this._subscribe();
    if (changed.has("_edit") && this._edit) {
      const field = this.renderRoot.querySelector<HTMLTextAreaElement | HTMLInputElement>(".editor .field");
      if (field && this.renderRoot.ownerDocument?.activeElement !== field && !field.dataset.focused) {
        field.dataset.focused = "1";
        field.focus();
      }
    }
  }

  private _unsubscribe(): void {
    const u = this._unsub;
    this._unsub = undefined;
    this._subscribedTo = undefined;
    u?.then((f) => f()).catch(() => undefined);
  }

  private _subscribe(): void {
    const entity = this._config?.entity;
    if (!this.hass || !entity || !this.isConnected || !this.hass.states[entity]) return;
    if (this._subscribedTo === entity) return;
    this._unsubscribe();
    this._subscribedTo = entity;
    this._unsub = this.hass.connection.subscribeMessage<{ items: TodoItem[] }>(
      (msg) => {
        this._items = msg.items;
      },
      { type: "todo/item/subscribe", entity_id: entity },
    );
    this._unsub.catch((err: unknown) => {
      this._subscribedTo = undefined;
      this._error = this._t("error", { error: errText(err) });
    });
  }

  private _supports(feature: number): boolean {
    const f = Number(this.hass?.states[this._config!.entity]?.attributes.supported_features ?? 0);
    return (f & feature) === feature;
  }

  private async _update(item: TodoItem, data: { status?: TodoItem["status"]; description?: string }): Promise<boolean> {
    this._busy = new Set(this._busy).add(item.uid);
    this._error = undefined;
    try {
      await this.hass!.callService("todo", "update_item", { item: item.uid, ...data }, { entity_id: this._config!.entity });
      return true;
    } catch (err) {
      this._error = this._t("error", { error: errText(err) });
      return false;
    } finally {
      const b = new Set(this._busy);
      b.delete(item.uid);
      this._busy = b;
    }
  }

  private _toggleDone(v: ViewItem): void {
    void this._update(v.item, { status: v.item.status === "completed" ? "needs_action" : "completed" });
  }

  private _onAnnotateBox(v: ViewItem, ev: Event): void {
    // The checkbox mirrors the stored state; the actual change happens via the editor.
    (ev.target as HTMLInputElement).checked = v.annotation !== null;
    if (this._edit?.uid === v.item.uid) {
      this._edit = undefined;
      return;
    }
    this._edit = {
      uid: v.item.uid,
      text: v.annotation === null ? "" : decodeText(v.annotation, this._fmt, this._config!.multiline),
      isNew: v.annotation === null,
    };
  }

  private async _save(v: ViewItem): Promise<void> {
    const text = this._edit?.text ?? "";
    if (!text.trim()) {
      if (v.annotation !== null) await this._remove(v);
      else this._edit = undefined;
      return;
    }
    const data: { status?: TodoItem["status"]; description: string } = {
      description: mergeDescription(v.base, text, this._fmt),
    };
    if (this._config!.auto_complete && v.item.status !== "completed") data.status = "completed";
    if (await this._update(v.item, data)) this._edit = undefined;
  }

  private async _remove(v: ViewItem): Promise<void> {
    const data: { status?: TodoItem["status"]; description: string } = { description: mergeDescription(v.base, null, this._fmt) };
    if (this._config!.on_remove === "reopen" && v.item.status === "completed") data.status = "needs_action";
    if (await this._update(v.item, data)) this._edit = undefined;
  }

  private _toggleExpand(uid: string): void {
    const e = new Set(this._expanded);
    if (e.has(uid)) e.delete(uid);
    else e.add(uid);
    this._expanded = e;
  }

  private _onEditorKey(v: ViewItem, ev: KeyboardEvent): void {
    if (ev.key === "Escape") {
      ev.preventDefault();
      this._edit = undefined;
    } else if (ev.key === "Enter" && (!this._config!.multiline || ev.ctrlKey || ev.metaKey)) {
      ev.preventDefault();
      void this._save(v);
    }
  }

  // ------------------------------------------------------------------ render
  protected render(): TemplateResult | typeof nothing {
    if (!this._config || !this.hass) return nothing;
    const t = this._t;
    const cfg = this._config;
    const stateObj = cfg.entity ? this.hass.states[cfg.entity] : undefined;
    const title = cfg.title ?? (stateObj?.attributes.friendly_name as string | undefined);
    const annLabel = cfg.annotation_label || t("annotate");

    let body: TemplateResult;
    if (!cfg.entity) body = html`<div class="message">${t("no_entity")}</div>`;
    else if (!stateObj) body = html`<div class="message warning">${t("not_found", { entity: cfg.entity })}</div>`;
    else if (this._items === undefined) body = html`<div class="message muted" aria-busy="true">…</div>`;
    else {
      const canEdit = this._supports(TodoFeature.UPDATE_TODO_ITEM);
      const canDescribe = this._supports(TodoFeature.SET_DESCRIPTION_ON_ITEM);
      const groups = buildView(this._items, cfg);
      body = html`
        ${!canDescribe ? html`<div class="message warning" role="note">${t("unsupported")}</div>` : nothing}
        ${groups.length === 0
          ? html`<div class="message muted">${t("no_items")}</div>`
          : html`
              ${cfg.show_header
                ? html`<div class="legend" aria-hidden="true">
                    <span class="lg"><span class="sw done"></span>${t("done")}</span>
                    <span class="lg"><span class="sw ann"></span>${cfg.marker ? html`<span class="lg-marker">${cfg.marker}</span>` : nothing}${annLabel}</span>
                  </div>`
                : nothing}
              ${groups.map(
                (g) => html`
                  <section class="group" aria-label=${this._groupLabel(g.kind, g.key)}>
                    ${g.kind !== "all" ? html`<h3 class="group-title">${this._groupLabel(g.kind, g.key)}</h3>` : nothing}
                    <ul role="list">
                      ${g.items.map((v) => this._renderItem(v, annLabel, canEdit, canDescribe))}
                    </ul>
                  </section>
                `,
              )}
            `}
      `;
    }
    return html`
      <ha-card class=${cfg.compact ? "compact" : ""}>
        ${title ? html`<h1 class="card-header">${title}</h1>` : nothing}
        ${this._error ? html`<div class="message error" role="alert">${this._error}</div>` : nothing}
        <div class="content">${body}</div>
      </ha-card>
    `;
  }

  private _groupLabel(kind: string, key: string): string {
    const t = this._t;
    if (kind === "completed") return t("completed");
    if (kind === "nodate") return t("no_date");
    if (kind === "day") {
      const d = new Date(`${key}T12:00:00`);
      try {
        return new Intl.DateTimeFormat(this.hass?.locale?.language ?? this.hass?.language ?? "en", {
          weekday: "long",
          day: "numeric",
          month: "long",
        }).format(d);
      } catch {
        return key;
      }
    }
    return "";
  }

  private _formatDue(due: string): string {
    const lang = this.hass?.locale?.language ?? this.hass?.language ?? "en";
    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(due)) {
        return new Intl.DateTimeFormat(lang, { weekday: "short", day: "numeric", month: "short" }).format(new Date(`${due}T12:00:00`));
      }
      const d = new Date(due);
      const opts: Intl.DateTimeFormatOptions =
        this._config!.group_by === "due_day"
          ? { hour: "2-digit", minute: "2-digit" }
          : { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" };
      return new Intl.DateTimeFormat(lang, opts).format(d);
    } catch {
      return due;
    }
  }

  private _renderItem(v: ViewItem, annLabel: string, canEdit: boolean, canDescribe: boolean): TemplateResult {
    const t = this._t;
    const cfg = this._config!;
    const it = v.item;
    const done = it.status === "completed";
    const annotated = v.annotation !== null;
    const busy = this._busy.has(it.uid);
    const editing = this._edit?.uid === it.uid;
    const expanded = this._expanded.has(it.uid);
    // Annotated items show only the note; the base text appears on tap. Normal items follow `description`.
    const collapsible = annotated ? v.base.length > 0 : cfg.description === "collapsed" && v.base.length > 0;
    const showBase = v.base.length > 0 && (annotated || cfg.description === "collapsed" ? expanded : cfg.description === "always");
    const detailsId = `d-${cssId(it.uid)}`;
    const shownAnnotation = annotated ? decodeText(v.annotation!, this._fmt, true) : "";

    const main = html`
      <span class="summary">
        ${annotated && cfg.marker ? html`<span class="marker" aria-hidden="true">${cfg.marker}</span>` : nothing}
        <span class="text">${it.summary}</span>
        ${annotated ? html`<span class="sr-only">(${annLabel})</span>` : nothing}
      </span>
      ${annotated ? html`<span class="annotation">${shownAnnotation}</span>` : nothing}
      ${cfg.show_due && it.due && (cfg.group_by !== "due_day" || !/^\d{4}-\d{2}-\d{2}$/.test(it.due))
        ? html`<span class="due">${this._formatDue(it.due)}</span>`
        : nothing}
    `;

    return html`
      <li class="item ${done ? "done" : ""} ${annotated ? "annotated" : ""} ${busy ? "busy" : ""}" aria-busy=${busy ? "true" : "false"}>
        <label class="box" title=${t("done")}>
          <input
            type="checkbox"
            .checked=${done}
            ?disabled=${!canEdit || busy}
            aria-label=${`${t("done")}: ${it.summary}`}
            @change=${() => this._toggleDone(v)}
          />
        </label>
        <label class="box ann" title=${annLabel}>
          <input
            type="checkbox"
            .checked=${annotated}
            ?disabled=${!canEdit || !canDescribe || busy}
            aria-label=${`${annLabel}: ${it.summary}`}
            aria-expanded=${editing ? "true" : "false"}
            @change=${(ev: Event) => this._onAnnotateBox(v, ev)}
          />
          ${cfg.annotation_icon && cfg.show_header === false
            ? html`<ha-icon class="ann-icon" .icon=${cfg.annotation_icon} aria-hidden="true"></ha-icon>`
            : nothing}
        </label>
        <div class="body">
          ${collapsible
            ? html`<button
                class="main"
                type="button"
                aria-expanded=${expanded ? "true" : "false"}
                aria-controls=${detailsId}
                title=${expanded ? t("hide_details") : t("show_details")}
                @click=${() => this._toggleExpand(it.uid)}
              >
                ${main}<span class="chev" aria-hidden="true">${expanded ? "▴" : "▾"}</span>
              </button>`
            : html`<div class="main">${main}</div>`}
          ${showBase ? html`<div class="base" id=${detailsId}>${v.base}</div>` : nothing}
          ${annotated && expanded && !editing && canEdit && canDescribe
            ? html`<div class="actions inline">
                <button type="button" class="link" @click=${() => this._onAnnotateBox(v, { target: { checked: true } } as unknown as Event)}>
                  ${t("edit", { label: annLabel })}
                </button>
              </div>`
            : nothing}
          ${editing ? this._renderEditor(v, annLabel) : nothing}
        </div>
      </li>
    `;
  }

  private _renderEditor(v: ViewItem, annLabel: string): TemplateResult {
    const t = this._t;
    const cfg = this._config!;
    const busy = this._busy.has(v.item.uid);
    const onInput = (ev: Event) => {
      this._edit = { ...this._edit!, text: (ev.target as HTMLInputElement).value };
    };
    return html`
      <div class="editor" role="group" aria-label=${`${annLabel}: ${v.item.summary}`}>
        ${cfg.multiline
          ? html`<textarea
              class="field"
              rows="2"
              .value=${this._edit!.text}
              placeholder=${t("placeholder")}
              aria-label=${annLabel}
              ?disabled=${busy}
              @input=${onInput}
              @keydown=${(ev: KeyboardEvent) => this._onEditorKey(v, ev)}
            ></textarea>`
          : html`<input
              class="field"
              type="text"
              .value=${this._edit!.text}
              placeholder=${t("placeholder")}
              aria-label=${annLabel}
              ?disabled=${busy}
              @input=${onInput}
              @keydown=${(ev: KeyboardEvent) => this._onEditorKey(v, ev)}
            />`}
        <div class="actions">
          ${!this._edit!.isNew
            ? html`<button type="button" class="btn danger" ?disabled=${busy} @click=${() => this._remove(v)}>${t("remove", { label: annLabel })}</button>`
            : nothing}
          <span class="spacer"></span>
          <button type="button" class="btn" ?disabled=${busy} @click=${() => (this._edit = undefined)}>${t("cancel")}</button>
          <button type="button" class="btn primary" ?disabled=${busy || !this._edit!.text.trim()} @click=${() => this._save(v)}>
            ${t("save")}
          </button>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      --tac-marker-color: var(--warning-color, #ff9800);
      --tac-row-gap: 10px;
    }
    ha-card {
      overflow: hidden;
    }
    .card-header {
      margin: 0;
      padding: 16px 16px 4px;
      font-size: var(--ha-card-header-font-size, 1.5rem);
      font-weight: var(--ha-font-weight-normal, 400);
      color: var(--ha-card-header-color, var(--primary-text-color));
      line-height: 1.3;
    }
    .content {
      padding: 4px 8px 12px;
    }
    .message {
      padding: 12px 8px;
      color: var(--primary-text-color);
    }
    .message.muted {
      color: var(--secondary-text-color);
    }
    .message.warning {
      border-left: 4px solid var(--warning-color, #ff9800);
      background: color-mix(in srgb, var(--warning-color, #ff9800) 12%, transparent);
      border-radius: 4px;
      margin: 8px;
    }
    .message.error {
      border-left: 4px solid var(--error-color, #db4437);
      background: color-mix(in srgb, var(--error-color, #db4437) 12%, transparent);
      border-radius: 4px;
      margin: 8px 16px 0;
    }
    .item {
      display: grid;
      grid-template-columns: 44px 44px 1fr;
      align-items: start;
    }
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 16px;
      padding: 0 8px 4px 12px;
      font-size: 0.8rem;
      color: var(--secondary-text-color);
    }
    .lg {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .sw {
      width: 12px;
      height: 12px;
      border-radius: 3px;
      background: var(--primary-color);
    }
    .sw.ann {
      background: var(--tac-marker-color);
    }
    .lg-marker {
      margin-right: -2px;
    }
    .group-title {
      margin: 12px 8px 2px;
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .item {
      border-radius: 8px;
      padding: 2px 0;
    }
    .item + .item {
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
    }
    .item.busy {
      opacity: 0.6;
    }
    .box {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      min-width: 44px;
      cursor: pointer;
      position: relative;
    }
    .box input {
      width: 20px;
      height: 20px;
      margin: 0;
      cursor: pointer;
      accent-color: var(--primary-color);
    }
    .box.ann input {
      accent-color: var(--tac-marker-color);
    }
    .box input:disabled {
      cursor: default;
    }
    .ann-icon {
      --mdc-icon-size: 14px;
      position: absolute;
      right: 2px;
      top: 4px;
      color: var(--secondary-text-color);
    }
    .body {
      min-width: 0;
      padding: 0 8px 0 2px;
    }
    .main {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 2px 8px;
      width: 100%;
      min-height: 44px;
      box-sizing: border-box;
      padding: 11px 0;
      text-align: left;
      font: inherit;
      color: inherit;
      background: none;
      border: 0;
      border-radius: 6px;
    }
    button.main {
      cursor: pointer;
      padding-right: 22px;
      position: relative;
    }
    button.main:focus-visible,
    .btn:focus-visible,
    .link:focus-visible,
    .box input:focus-visible,
    .field:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .chev {
      position: absolute;
      right: 4px;
      top: 12px;
      color: var(--secondary-text-color);
      font-size: 0.8rem;
    }
    .summary {
      flex: 1 1 100%;
      color: var(--primary-text-color);
      word-break: break-word;
    }
    .marker {
      color: var(--tac-marker-color);
      margin-right: 4px;
    }
    .item.done .text {
      color: var(--secondary-text-color);
      text-decoration: line-through;
      text-decoration-color: color-mix(in srgb, var(--secondary-text-color) 60%, transparent);
    }
    .item.done.annotated .text {
      text-decoration: none;
      color: var(--primary-text-color);
    }
    .annotation {
      flex: 1 1 100%;
      color: var(--primary-text-color);
      font-weight: 500;
      white-space: pre-line;
      word-break: break-word;
    }
    .due {
      font-size: 0.8rem;
      color: var(--secondary-text-color);
    }
    .base {
      white-space: pre-line;
      word-break: break-word;
      color: var(--secondary-text-color);
      font-size: 0.9rem;
      padding: 0 0 10px;
      margin-top: -6px;
    }
    .item.annotated .base {
      border-left: 3px solid var(--divider-color, rgba(127, 127, 127, 0.3));
      padding-left: 8px;
      margin-top: -4px;
    }
    .editor {
      padding: 2px 0 12px;
    }
    .field {
      width: 100%;
      box-sizing: border-box;
      font: inherit;
      font-size: 16px; /* prevents iOS zoom on focus */
      color: var(--primary-text-color);
      background: var(--input-fill-color, var(--secondary-background-color, rgba(127, 127, 127, 0.08)));
      border: 1px solid var(--input-idle-line-color, var(--divider-color, rgba(127, 127, 127, 0.4)));
      border-radius: 8px;
      padding: 10px 12px;
      resize: vertical;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
      align-items: center;
    }
    .actions.inline {
      margin: -4px 0 8px;
    }
    .spacer {
      flex: 1;
    }
    .btn,
    .link {
      font: inherit;
      font-size: 0.9rem;
      font-weight: 500;
      min-height: 40px;
      padding: 0 14px;
      border-radius: 20px;
      cursor: pointer;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.4));
      background: transparent;
      color: var(--primary-color);
    }
    .btn.primary {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .btn.danger {
      color: var(--error-color, #db4437);
    }
    .btn:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .link {
      border: 0;
      padding: 0 4px;
      min-height: 32px;
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }
    .compact .card-header {
      padding: 12px 12px 0;
      font-size: 1.2rem;
    }
    .compact .main {
      min-height: 36px;
      padding: 7px 0;
    }
    .compact .box {
      min-height: 36px;
    }
    .compact .item {
      grid-template-columns: 38px 38px 1fr;
    }
  `;
}

const errText = (err: unknown): string =>
  err && typeof err === "object" && "message" in err ? String((err as { message: unknown }).message) : String(err);

const cssId = (s: string): string => s.replace(/[^a-zA-Z0-9_-]/g, "_");

export { dueDay };

if (!customElements.get(TAG)) customElements.define(TAG, TodoAnnotateCard);

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}
window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === TAG)) {
  window.customCards.push({
    type: TAG,
    name: "Todo Annotate Card",
    description: "To-do list with a second checkbox to attach a note (e.g. a deviation) to an item.",
    preview: true,
    documentationURL: "https://github.com/LuFuhrmann/todo-annotate-card",
  });
}
console.info(`%c TODO-ANNOTATE-CARD %c ${CARD_VERSION} `, "color:#fff;background:#03a9f4;font-weight:700", "color:#03a9f4");
