import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { decodeText, effectiveSkipFormat, mergeMarkers, parseMarkers, templateHasPlaceholder, type AnnotationFormat, type SkipFormat } from "./annotation";
import { resolveConfig, type ResolvedConfig } from "./config";
import { applyChoice, clearChoice, dishesForSlot, dishInfo, displayNote, orderForDay, parseChoice, plannedDishId, readDishes, readHints, slotOf, splitDishRef, withDishRef, type Dish, type ItemHint } from "./dishes";
import { clearDraft, readDraft, writeDraft } from "./drafts";
import { applyGesture, type DraftStore, type EditorState, type RowState, type SessionGesture, type SessionPolicy } from "./edit-session";
import { buildView, dueDay, type ViewItem } from "./list";
import { localizer, type Localizer } from "./localize";
import { TodoFeature, type HomeAssistant, type TodoAnnotateCardConfig, type TodoItem } from "./types";
import "./todo-annotate-card-editor";

export const CARD_VERSION = "1.2.1";
const TAG = "todo-annotate-card";

export class TodoAnnotateCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _items: { state: true },
    _edit: { state: true },
    _expanded: { state: true },
    _busy: { state: true },
    _error: { state: true },
    _confirm: { state: true },
    _picker: { state: true },
    _pickFilter: { state: true },
  };

  hass?: HomeAssistant;
  private _config?: ResolvedConfig;
  private _items?: TodoItem[];
  private _edit?: EditorState;
  private _confirm?: { uid: string; text: string; gesture: SessionGesture };
  private _expanded = new Set<string>();
  /** uid of the item whose dish picker is open. */
  private _picker?: string;
  private _pickFilter = "";
  private _dishCache?: { attrs: unknown; dishes: Dish[]; hints: Map<string, ItemHint> };
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
    const cfg = this._runtime();
    return { template: cfg?.format ?? "❗ Abweichung: {text}", separator: cfg?.separator ?? " / " };
  }

  /** Resolved config with the language-specific skip line filled in. */
  private _runtime(): ResolvedConfig | undefined {
    if (!this._config) return undefined;
    if (!this._config.skip) return this._config;
    const lang = this.hass?.locale?.language ?? this.hass?.language;
    return { ...this._config, skip_format: effectiveSkipFormat(this._config.skip_format, lang) };
  }

  private _skipFmt(cfg: ResolvedConfig): SkipFormat | null {
    return cfg.skip && cfg.skip_format ? { template: cfg.skip_format, separator: cfg.separator } : null;
  }

  private _policy(): SessionPolicy {
    const cfg = this._runtime()!;
    return {
      autoComplete: cfg.auto_complete,
      onRemove: cfg.on_remove,
      annotation: { template: cfg.format, separator: cfg.separator },
      skip: this._skipFmt(cfg),
      multiline: cfg.multiline,
    };
  }

  private get _lang(): string | undefined {
    return this.hass?.locale?.language ?? this.hass?.language;
  }

  /** Dish catalog from `dishes_entity` (cached per attributes object). */
  private _dishes(): Dish[] {
    const id = this._config?.dishes_entity;
    if (!id) return [];
    const attrs = this.hass?.states[id]?.attributes;
    if (!this._dishCache || this._dishCache.attrs !== attrs) this._dishCache = { attrs, dishes: readDishes(attrs), hints: readHints(attrs) };
    return this._dishCache!.dishes;
  }

  private _hint(summary: string): ItemHint | undefined {
    this._dishes();
    return this._dishCache?.hints.get(summary);
  }

  private _slotDishes(v: ViewItem): { slot: string | null; dishes: Dish[] } {
    const slot = slotOf(v.item.summary, this._config?.dish_slot_pattern);
    return { slot, dishes: dishesForSlot(this._dishes(), slot) };
  }

  /** Writes the chosen dish (or the original plan for `null`) into the item description. */
  private async _choose(v: ViewItem, dish: Dish | null): Promise<void> {
    const cfg = this._runtime()!;
    const pc = parseChoice(v.base);
    // Picking the dish the plan already has, with no earlier change, changes nothing.
    if (dish && !pc.choice && dish.id === plannedDishId(pc.text, this._dishes(), this._hint(v.item.summary))) {
      this._togglePicker(v.item.uid);
      return;
    }
    const base = dish ? applyChoice(v.base, dish, this._lang) : clearChoice(v.base);
    const description = mergeMarkers(base, v.annotation, v.skip, this._fmt, this._skipFmt(cfg));
    if (await this._update(v.item, { description })) {
      this._picker = undefined;
      this._pickFilter = "";
    }
  }

  private _togglePicker(uid: string): void {
    this._pickFilter = "";
    this._picker = this._picker === uid ? undefined : uid;
  }

  private _drafts(): DraftStore {
    const entity = this._config?.entity ?? "";
    return { get: (uid, kind) => readDraft(entity, uid, kind) };
  }

  private _rowOf(v: ViewItem): RowState {
    return { uid: v.item.uid, status: v.item.status, base: v.base, annotation: v.annotation, skip: v.skip };
  }

  private _rowByUid(uid: string): RowState | null {
    const cfg = this._runtime();
    const item = this._items?.find((it) => it.uid === uid);
    if (!cfg || !item) return null;
    const parsed = parseMarkers(item.description, { template: cfg.format, separator: cfg.separator }, this._skipFmt(cfg));
    return { uid, status: item.status, ...parsed };
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
    // Setting `.checked` during render clears `indeterminate` in some browsers.
    for (const el of this.renderRoot.querySelectorAll<HTMLInputElement>("input[data-pending]")) {
      el.indeterminate = el.dataset.pending === "1";
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

  private async _dispatch(gesture: SessionGesture): Promise<void> {
    const cfg = this._config;
    if (!cfg || !cfg.entity) return;
    if (this._busy.size && gesture.type !== "input") return;
    if (gesture.type !== "input") this._picker = undefined;
    const editor = this._edit ?? null;
    const plan = applyGesture(editor, editor ? this._rowByUid(editor.uid) : null, gesture, this._policy(), this._drafts());
    if (plan.confirmRemoveAnnotation && (gesture.type === "skip" || gesture.type === "save")) {
      this._confirm = { uid: gesture.row.uid, text: plan.confirmRemoveAnnotation.text, gesture };
      return;
    }
    if (plan.forgetDraft) clearDraft(cfg.entity, plan.forgetDraft.uid, plan.forgetDraft.kind);
    if (plan.remember) writeDraft(cfg.entity, plan.remember.uid, plan.remember.kind, plan.remember.text);
    if (plan.updates.length === 0) {
      this._edit = plan.editor ?? undefined;
      this._confirm = undefined;
      return;
    }
    const previous = this._edit;
    for (const update of plan.updates) {
      const item = this._items?.find((it) => it.uid === update.uid);
      if (!item) return;
      const data: { status?: TodoItem["status"]; description?: string } = {};
      if (update.description !== undefined) data.description = update.description;
      if (update.status) data.status = update.status;
      if (!(await this._update(item, data))) {
        this._edit = previous;
        return;
      }
    }
    for (const update of plan.updates) for (const kind of update.clearDrafts) clearDraft(cfg.entity, update.uid, kind);
    this._edit = plan.editor ?? undefined;
    this._confirm = undefined;
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
      void this._dispatch({ type: "cancel" });
    } else if (ev.key === "Enter" && (!this._config!.multiline || ev.ctrlKey || ev.metaKey)) {
      ev.preventDefault();
      void this._dispatch({ type: "save", row: this._rowOf(v) });
    }
  }

  // ------------------------------------------------------------------ render
  protected render(): TemplateResult | typeof nothing {
    if (!this._config || !this.hass) return nothing;
    const t = this._t;
    const cfg = this._runtime()!;
    const stateObj = cfg.entity ? this.hass.states[cfg.entity] : undefined;
    const title = cfg.title ?? (stateObj?.attributes.friendly_name as string | undefined);
    const annLabel = cfg.annotation_label || t("annotate");
    const skipLabel = cfg.skip_label || t("skipped");

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
        ${cfg.dishes_entity && !this.hass.states[cfg.dishes_entity]
          ? html`<div class="message muted" role="note">${t("dishes_missing", { entity: cfg.dishes_entity })}</div>`
          : nothing}
        ${groups.length === 0
          ? html`<div class="message muted">${t("no_items")}</div>`
          : html`
              ${cfg.show_header
                ? html`<div class="legend" aria-hidden="true">
                    <span class="lg"><span class="sw done"></span>${t("done")}</span>
                    <span class="lg"><span class="sw ann"></span>${cfg.marker ? html`<span class="lg-marker">${cfg.marker}</span>` : nothing}${annLabel}</span>
                    ${cfg.skip ? html`<span class="lg"><span class="sw skip"></span>${skipLabel}</span>` : nothing}
                  </div>`
                : nothing}
              ${groups.map(
                (g) => html`
                  <section class="group" aria-label=${this._groupLabel(g.kind, g.key)}>
                    ${g.kind !== "all" ? html`<h3 class="group-title">${this._groupLabel(g.kind, g.key)}</h3>` : nothing}
                    <ul role="list">
                      ${g.items.map((v) => this._renderItem(v, annLabel, skipLabel, canEdit, canDescribe))}
                    </ul>
                  </section>
                `,
              )}
            `}
      `;
    }
    const replanOn = !!cfg.dishes_entity && cfg.replan;
    const cardClass = [cfg.compact ? "compact" : "", cfg.skip ? "skip-on" : "", replanOn ? "replan-on" : ""].filter(Boolean).join(" ");
    return html`
      <ha-card class=${cardClass}>
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

  private _renderItem(v: ViewItem, annLabel: string, skipLabel: string, canEdit: boolean, canDescribe: boolean): TemplateResult {
    const t = this._t;
    const cfg = this._runtime()!;
    const it = v.item;
    const done = it.status === "completed";
    const annotated = v.annotation !== null;
    const skipped = cfg.skip && v.skip !== null;
    const busy = this._busy.has(it.uid);
    const editing = this._edit?.uid === it.uid;
    const editingNote = editing && this._edit?.kind === "annotation";
    const editingSkip = editing && this._edit?.kind === "skip";
    const expanded = this._expanded.has(it.uid);
    const flagged = annotated || skipped;
    // A chosen dish replaces the plan text; the original plan is shown on tap.
    const pc = parseChoice(v.base);
    const baseText = pc.text;
    const original = pc.choice ? pc.original : null;
    // Annotated and skipped items reveal the plan on tap. Other items follow `description`.
    const collapsible = (flagged ? baseText.length > 0 : cfg.description === "collapsed" && baseText.length > 0) || !!original;
    const showBase = baseText.length > 0 && (flagged || cfg.description === "collapsed" ? expanded : cfg.description === "always");
    const replanOn = !!cfg.dishes_entity && cfg.replan;
    const sd = replanOn ? this._slotDishes(v) : { slot: null, dishes: [] as Dish[] };
    const canReplan = replanOn && !done && !skipped && canEdit && canDescribe && (sd.dishes.length > 0 || !!pc.choice);
    const picking = this._picker === it.uid && canReplan;
    const replanLabel = cfg.replan_label || t("replan");
    const detailsId = `d-${cssId(it.uid)}`;
    const pendingId = `p-${cssId(it.uid)}`;
    const shownAnnotation = annotated ? displayNote(decodeText(v.annotation!, this._fmt, true)) : "";
    const skipFmt = this._skipFmt(cfg);
    const skipReason = skipped && v.skip && skipFmt && templateHasPlaceholder(skipFmt.template) ? decodeText(v.skip, skipFmt, true) : "";
    const confirming = this._confirm?.uid === it.uid;

    const main = html`
      <span class="summary">
        ${skipped ? html`<span class="marker skip-mark" aria-hidden="true">⊘</span>` : nothing}
        ${annotated && !skipped && cfg.marker ? html`<span class="marker" aria-hidden="true">${cfg.marker}</span>` : nothing}
        <span class="text">${it.summary}</span>
        ${annotated ? html`<span class="sr-only">(${annLabel})</span>` : nothing}
        ${skipped ? html`<span class="sr-only">(${skipLabel}${skipReason ? `: ${skipReason}` : ""})</span>` : nothing}
      </span>
      ${pc.choice ? html`<span class="choice"><span aria-hidden="true">🔁 </span>${t("chosen", { name: pc.choice.name })}</span>` : nothing}
      ${skipped ? html`<span class="skip-hint">${skipLabel}${skipReason ? `: ${skipReason}` : ""}</span>` : nothing}
      ${annotated ? html`<span class="annotation">${shownAnnotation}</span>` : nothing}
      ${cfg.show_due && it.due && (cfg.group_by !== "due_day" || !/^\d{4}-\d{2}-\d{2}$/.test(it.due))
        ? html`<span class="due">${this._formatDue(it.due)}</span>`
        : nothing}
    `;

    return html`
      <li class="item ${done ? "done" : ""} ${annotated ? "annotated" : ""} ${skipped ? "skipped" : ""} ${busy ? "busy" : ""}" aria-busy=${busy ? "true" : "false"}>
        <label class="box done" title=${t("done")}>
          <input
            type="checkbox"
            .checked=${done}
            ?disabled=${!canEdit || busy}
            aria-label=${`${t("done")}: ${it.summary}`}
            @change=${() => void this._dispatch({ type: "done", row: this._rowOf(v) })}
          />
        </label>
        <label class="box ann" title=${editingNote ? t("unsaved") : annLabel}>
          <input
            type="checkbox"
            data-pending=${editingNote ? "1" : "0"}
            .checked=${annotated}
            .indeterminate=${editingNote}
            ?disabled=${!canEdit || !canDescribe || busy}
            aria-label=${editingNote ? `${annLabel}: ${it.summary}. ${t("unsaved")}` : `${annLabel}: ${it.summary}`}
            aria-expanded=${editingNote ? "true" : "false"}
            aria-describedby=${editingNote ? pendingId : nothing}
            @change=${() => void this._dispatch({ type: "annotate", row: this._rowOf(v) })}
          />
          ${cfg.annotation_icon && cfg.show_header === false
            ? html`<ha-icon class="ann-icon" .icon=${cfg.annotation_icon} aria-hidden="true"></ha-icon>`
            : nothing}
        </label>
        ${cfg.skip
          ? html`<label class="box skip" title=${editingSkip ? t("unsaved") : skipLabel}>
              <input
                type="checkbox"
                data-pending=${editingSkip ? "1" : "0"}
                .checked=${!!skipped}
                .indeterminate=${editingSkip}
                ?disabled=${!canEdit || !canDescribe || busy}
                aria-label=${editingSkip ? `${skipLabel}: ${it.summary}. ${t("unsaved")}` : `${skipLabel}: ${it.summary}`}
                aria-expanded=${editingSkip ? "true" : "false"}
                aria-describedby=${editingSkip ? pendingId : nothing}
                @change=${() => void this._dispatch({ type: "skip", row: this._rowOf(v) })}
              />
            </label>`
          : nothing}
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
          ${showBase || (original && expanded)
            ? html`<div class="base" id=${detailsId}>${showBase ? baseText : nothing}${original && expanded
                ? html`<div class="original">${t("original_plan", { text: original })}</div>`
                : nothing}</div>`
            : nothing}
          ${annotated && expanded && !editing && canEdit && canDescribe
            ? html`<div class="actions inline">
                <button type="button" class="link" @click=${() => void this._dispatch({ type: "annotate", row: this._rowOf(v) })}>
                  ${t("edit", { label: annLabel })}
                </button>
              </div>`
            : nothing}
          ${skipped && expanded && !editing && canEdit && canDescribe && skipFmt && templateHasPlaceholder(skipFmt.template)
            ? html`<div class="actions inline">
                <button type="button" class="link" @click=${() => void this._dispatch({ type: "edit-skip", row: this._rowOf(v) })}>
                  ${t("edit", { label: skipLabel })}
                </button>
              </div>`
            : nothing}
          ${confirming ? this._renderConfirm() : nothing}
          ${picking ? this._renderPicker(v, sd.slot, sd.dishes, pc.choice?.id ?? null) : nothing}
          ${editing ? this._renderEditor(v, editingSkip ? skipLabel : annLabel, pendingId) : nothing}
        </div>
        ${replanOn
          ? canReplan
            ? html`<div class="box replan">
                <button
                  type="button"
                  class="replan-btn ${pc.choice ? "chosen" : ""}"
                  title=${replanLabel}
                  aria-label=${`${replanLabel}: ${it.summary}`}
                  aria-expanded=${picking ? "true" : "false"}
                  ?disabled=${busy || editing}
                  @click=${() => this._togglePicker(it.uid)}
                >⇄</button>
              </div>`
            : html`<div class="box replan" aria-hidden="true"></div>`
          : nothing}
      </li>
    `;
  }

  private _renderConfirm(): TemplateResult {
    const t = this._t;
    const text = this._confirm?.text ?? "";
    const gesture = this._confirm?.gesture;
    return html`
      <div class="confirm" role="alertdialog" aria-label=${t("confirm_remove")}>
        <p>${t("confirm_remove_note", { text })}</p>
        <div class="actions">
          <span class="spacer"></span>
          <button type="button" class="btn" @click=${() => (this._confirm = undefined)}>${t("cancel")}</button>
          <button
            type="button"
            class="btn danger"
            @click=${() => {
              if (!gesture || (gesture.type !== "skip" && gesture.type !== "save")) return;
              void this._dispatch({ ...gesture, confirmed: true });
            }}
          >
            ${t("confirm_remove")}
          </button>
        </div>
      </div>
    `;
  }

  private _renderPicker(v: ViewItem, slot: string | null, dishes: Dish[], current: string | null): TemplateResult {
    const t = this._t;
    const busy = this._busy.has(v.item.uid);
    const f = this._pickFilter.trim().toLocaleLowerCase();
    const hint = this._hint(v.item.summary);
    const pc = parseChoice(v.base);
    const planned = plannedDishId(pc.choice ? (pc.original ?? "") : pc.text, this._dishes(), hint);
    const rows = orderForDay(dishes, hint?.tag);
    const shown = f ? rows.filter((r) => `${r.dish.name} ${r.dish.kurz ?? ""} ${r.dish.ort ?? ""}`.toLocaleLowerCase().includes(f)) : rows;
    const dayLabel = (tag: string) => (tag === "training" ? t("day_training") : tag === "ruhe" || tag === "rest" ? t("day_rest") : tag);
    const title = t("replan_title", { slot: slot ?? v.item.summary });
    return html`
      <div class="picker" role="group" aria-label=${`${title}: ${v.item.summary}`}>
        <p class="picker-title">${title}</p>
        ${dishes.length > 6
          ? html`<input
              class="field filter"
              type="search"
              .value=${this._pickFilter}
              placeholder=${t("replan_filter")}
              aria-label=${t("replan_filter")}
              @input=${(ev: Event) => (this._pickFilter = (ev.target as HTMLInputElement).value)}
            />`
          : nothing}
        <ul class="dishes" role="list">
          ${shown.map(
            ({ dish: d, fits }) => html`<li>
              <button
                type="button"
                class="dish ${d.id === current ? "current" : ""}"
                aria-pressed=${d.id === current ? "true" : "false"}
                ?disabled=${busy}
                @click=${() => void this._choose(v, d)}
              >
                <span class="dish-name"
                  >${d.name}${d.id === current
                    ? html` <span class="dish-cur">· ${t("replan_current")}</span>`
                    : d.id === planned
                      ? html` <span class="dish-cur">· ${t("replan_planned")}</span>`
                      : nothing}</span
                >
                ${!fits ? html`<span class="dish-day">${t("dish_other_day", { days: d.tage.map(dayLabel).join(", ") })}</span>` : nothing}
                ${dishInfo(d, this._lang) ? html`<span class="dish-info">${dishInfo(d, this._lang)}</span>` : nothing}
                ${d.kurz ? html`<span class="dish-kurz">${d.kurz}</span>` : nothing}
              </button>
            </li>`,
          )}
        </ul>
        ${shown.length === 0 ? html`<p class="message muted">${t("replan_none")}</p>` : nothing}
        <div class="actions">
          ${current
            ? html`<button type="button" class="btn danger" ?disabled=${busy} @click=${() => void this._choose(v, null)}>${t("replan_back")}</button>`
            : nothing}
          <span class="spacer"></span>
          <button type="button" class="btn" ?disabled=${busy} @click=${() => this._togglePicker(v.item.uid)}>${t("cancel")}</button>
        </div>
      </div>
    `;
  }

  /** Dish list in the note editor: picking sets the `[id] Name` line, free text stays. */
  private _renderDishSelect(v: ViewItem): TemplateResult | typeof nothing {
    const cfg = this._runtime()!;
    if (!cfg.dishes_entity || !cfg.dish_in_note || this._edit?.kind !== "annotation") return nothing;
    const all = this._dishes();
    if (!all.length) return nothing;
    const t = this._t;
    const { slot, dishes } = this._slotDishes(v);
    const fit = new Set(dishes.map((d) => d.id));
    const others = all.filter((d) => !fit.has(d.id));
    const joiner = cfg.multiline ? "\n" : cfg.separator;
    const text = this._edit!.text;
    const firstLine = (cfg.multiline ? text.split("\n") : text.split(cfg.separator))[0] ?? "";
    const cur = splitDishRef(firstLine).ref?.id ?? "";
    const onChange = (ev: Event) => {
      const sel = ev.target as HTMLSelectElement;
      const d = all.find((x) => x.id === sel.value) ?? null;
      if (sel.value === "" && !cur) return;
      void this._dispatch({ type: "input", text: withDishRef(this._edit?.text ?? "", d, all, joiner) });
    };
    const opt = (d: Dish) => {
      const info = dishInfo(d, this._lang);
      return html`<option value=${d.id} ?selected=${d.id === cur}>${info ? `${d.name} (${info})` : d.name}</option>`;
    };
    return html`<select class="field dish-select" aria-label=${t("dish_pick")} @change=${onChange}>
      <option value="" ?selected=${!cur}>${cur ? t("dish_pick_none") : t("dish_pick")}</option>
      ${dishes.length ? html`<optgroup label=${t("dish_group_slot", { slot: slot ?? "" })}>${dishes.map(opt)}</optgroup>` : nothing}
      ${others.length ? html`<optgroup label=${t("dish_group_other")}>${others.map(opt)}</optgroup>` : nothing}
    </select>`;
  }

  private _renderEditor(v: ViewItem, label: string, pendingId: string): TemplateResult {
    const t = this._t;
    const cfg = this._runtime()!;
    const busy = this._busy.has(v.item.uid);
    const kind = this._edit?.kind ?? "annotation";
    const placeholder = kind === "skip" ? t("skip_placeholder") : t("placeholder");
    const onInput = (ev: Event) => {
      void this._dispatch({ type: "input", text: (ev.target as HTMLInputElement).value });
    };
    // An explicit Save of a skip reason may be empty (the line itself marks the item).
    const saveDisabled = busy || (kind === "annotation" && !this._edit!.text.trim());
    return html`
      <div class="editor" role="group" aria-label=${`${label}: ${v.item.summary}`}>
        <p class="pending" id=${pendingId} role="status">${t("unsaved")}</p>
        ${this._renderDishSelect(v)}
        ${cfg.multiline
          ? html`<textarea
              class="field"
              rows="2"
              .value=${this._edit!.text}
              placeholder=${placeholder}
              aria-label=${label}
              ?disabled=${busy}
              @input=${onInput}
              @keydown=${(ev: KeyboardEvent) => this._onEditorKey(v, ev)}
            ></textarea>`
          : html`<input
              class="field"
              type="text"
              .value=${this._edit!.text}
              placeholder=${placeholder}
              aria-label=${label}
              ?disabled=${busy}
              @input=${onInput}
              @keydown=${(ev: KeyboardEvent) => this._onEditorKey(v, ev)}
            />`}
        <div class="actions">
          ${!this._edit!.isNew
            ? html`<button type="button" class="btn danger" ?disabled=${busy} @click=${() => void this._dispatch({ type: "remove", row: this._rowOf(v) })}>${t("remove", { label })}</button>`
            : nothing}
          <span class="spacer"></span>
          <button type="button" class="btn" ?disabled=${busy} @click=${() => void this._dispatch({ type: "cancel" })}>${t("cancel")}</button>
          <button type="button" class="btn primary" ?disabled=${saveDisabled} @click=${() => void this._dispatch({ type: "save", row: this._rowOf(v) })}>
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
    .sw.skip {
      background: var(--secondary-text-color);
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
    .box.skip input {
      accent-color: var(--secondary-text-color);
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
    .item.skipped .text {
      color: var(--secondary-text-color);
      text-decoration: none;
    }
    .skip-mark {
      color: var(--secondary-text-color);
    }
    .skip-hint {
      flex: 1 1 100%;
      color: var(--secondary-text-color);
      font-size: 0.9rem;
      word-break: break-word;
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
    .pending {
      margin: 0 0 6px;
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--tac-marker-color);
    }
    .confirm {
      margin: 0 0 8px;
      padding: 8px 10px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--warning-color, #ff9800) 14%, transparent);
    }
    .confirm p {
      margin: 0;
      word-break: break-word;
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
    .choice {
      flex: 1 1 100%;
      color: var(--primary-color);
      font-size: 0.9rem;
      font-weight: 500;
      word-break: break-word;
    }
    .original {
      margin-top: 6px;
      font-style: italic;
    }
    .box.replan {
      align-self: start;
    }
    .replan-btn {
      width: 36px;
      height: 36px;
      border-radius: 18px;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.4));
      background: transparent;
      color: var(--primary-color);
      font: inherit;
      font-size: 1.1rem;
      line-height: 1;
      cursor: pointer;
    }
    .replan-btn.chosen {
      background: color-mix(in srgb, var(--primary-color) 16%, transparent);
      border-color: var(--primary-color);
    }
    .replan-btn:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .replan-btn:focus-visible,
    .dish:focus-visible,
    .dish-select:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .picker {
      padding: 2px 0 12px;
      color: var(--primary-text-color);
    }
    .picker-title {
      margin: 0 0 6px;
      font-size: 0.85rem;
      font-weight: 500;
      /* Raw --secondary-text-color is only ~4.4:1 on the old input fill. Mix toward the surface text so small type stays AA. */
      color: color-mix(in srgb, var(--secondary-text-color) 85%, var(--primary-text-color));
      -webkit-text-fill-color: currentColor;
    }
    .filter {
      margin-bottom: 6px;
    }
    .dishes li + li {
      margin-top: 6px;
    }
    .dish {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
      width: 100%;
      min-height: 44px;
      box-sizing: border-box;
      padding: 8px 12px;
      text-align: left;
      font: inherit;
      color: var(--primary-text-color);
      -webkit-text-fill-color: currentColor;
      /* Text tokens are for the card surface. --input-fill-color is a separate fill and made this text too light. */
      background: var(--card-background-color, var(--mdc-theme-surface, var(--ha-card-background)));
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3));
      border-radius: 10px;
      cursor: pointer;
    }
    .dish.current {
      border-color: var(--primary-color);
      box-shadow: inset 0 0 0 1px var(--primary-color);
    }
    .dish:disabled {
      opacity: 0.6;
      cursor: default;
    }
    .dish-name {
      font-weight: 500;
      color: var(--primary-text-color);
      -webkit-text-fill-color: currentColor;
    }
    .dish-cur {
      /* --primary-color is a brand fill (default light cyan) and fails as text on a light surface. */
      color: color-mix(in srgb, var(--primary-color) 50%, var(--primary-text-color));
      -webkit-text-fill-color: currentColor;
      font-weight: 400;
    }
    .dish-info {
      font-size: 0.8rem;
      color: color-mix(in srgb, var(--secondary-text-color) 85%, var(--primary-text-color));
      -webkit-text-fill-color: currentColor;
    }
    .dish-day {
      font-size: 0.8rem;
      color: color-mix(in srgb, var(--warning-color, #ff9800) 50%, var(--primary-text-color));
      -webkit-text-fill-color: currentColor;
    }
    .dish-kurz {
      font-size: 0.85rem;
      color: color-mix(in srgb, var(--secondary-text-color) 85%, var(--primary-text-color));
      -webkit-text-fill-color: currentColor;
      word-break: break-word;
    }
    .dish-select {
      margin-bottom: 8px;
      padding: 8px 10px;
      font-size: 16px;
      color: var(--primary-text-color);
      -webkit-text-fill-color: currentColor;
      background: var(--card-background-color, var(--mdc-theme-surface, var(--ha-card-background)));
      color-scheme: inherit;
    }
    .dish-select option,
    .dish-select optgroup {
      color: var(--primary-text-color);
      background-color: var(--card-background-color, var(--mdc-theme-surface, var(--ha-card-background)));
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
    .skip-on .item {
      grid-template-columns: 44px 44px 44px 1fr;
    }
    .compact.skip-on .item {
      grid-template-columns: 38px 38px 38px 1fr;
    }
    .replan-on .item {
      grid-template-columns: 44px 44px 1fr 44px;
    }
    .replan-on.skip-on .item {
      grid-template-columns: 44px 44px 44px 1fr 44px;
    }
    .compact.replan-on .item {
      grid-template-columns: 38px 38px 1fr 40px;
    }
    .compact.replan-on.skip-on .item {
      grid-template-columns: 38px 38px 38px 1fr 40px;
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
    description: "To-do list with a note checkbox, an optional skipped checkbox and an optional dish list.",
    preview: true,
    documentationURL: "https://github.com/LuFuhrmann/todo-annotate-card",
  });
}
console.info(`%c TODO-ANNOTATE-CARD %c ${CARD_VERSION} `, "color:#fff;background:#03a9f4;font-weight:700", "color:#03a9f4");
