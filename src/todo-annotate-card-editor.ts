import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { defaultSkipFormat } from "./annotation";
import { DEFAULTS } from "./config";
import { localizer, type Localizer } from "./localize";
import type { HomeAssistant, TodoAnnotateCardConfig } from "./types";

type Field =
  | { key: keyof TodoAnnotateCardConfig; kind: "text"; label: Parameters<Localizer>[0]; placeholder?: string }
  | { key: keyof TodoAnnotateCardConfig; kind: "bool"; label: Parameters<Localizer>[0] }
  | { key: keyof TodoAnnotateCardConfig; kind: "select"; label: Parameters<Localizer>[0]; options: [string, Parameters<Localizer>[0]][] };

/**
 * Visual editor built from plain, theme-aware form controls so it works in every
 * Home Assistant version without relying on lazily loaded internal elements.
 */
export class TodoAnnotateCardEditor extends LitElement {
  static properties = { hass: { attribute: false }, _config: { state: true } };
  hass?: HomeAssistant;
  private _config?: TodoAnnotateCardConfig;

  setConfig(config: TodoAnnotateCardConfig): void {
    this._config = { ...config };
  }

  private get _t(): Localizer {
    return localizer(this.hass?.locale?.language ?? this.hass?.language);
  }

  private _set(key: keyof TodoAnnotateCardConfig, value: unknown): void {
    if (!this._config) return;
    const next: Record<string, unknown> = { ...this._config };
    if (value === "" || value === undefined) delete next[key];
    else next[key] = value;
    this._config = next as unknown as TodoAnnotateCardConfig;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
  }

  private static readonly SECTIONS: { fields: Field[] }[] = [
    {
      fields: [
        { key: "title", kind: "text", label: "e_title" },
      ],
    },
    {
      fields: [
        { key: "annotation_label", kind: "text", label: "e_annotation_label" },
        { key: "annotation_icon", kind: "text", label: "e_annotation_icon", placeholder: DEFAULTS.annotation_icon },
        { key: "marker", kind: "text", label: "e_marker", placeholder: DEFAULTS.marker },
        { key: "format", kind: "text", label: "e_format", placeholder: DEFAULTS.format },
        { key: "auto_complete", kind: "bool", label: "e_auto_complete" },
        { key: "on_remove", kind: "select", label: "e_on_remove", options: [["keep", "e_on_remove_keep"], ["reopen", "e_on_remove_reopen"]] },
        { key: "multiline", kind: "bool", label: "e_multiline" },
        { key: "separator", kind: "text", label: "e_separator", placeholder: JSON.stringify(DEFAULTS.separator) },
      ],
    },
    {
      fields: [
        { key: "show_completed", kind: "bool", label: "e_show_completed" },
        { key: "completed_section", kind: "bool", label: "e_completed_section" },
        {
          key: "sort",
          kind: "select",
          label: "e_sort",
          options: [["manual", "e_sort_manual"], ["alpha", "e_sort_alpha"], ["due", "e_sort_due"], ["annotated_first", "e_sort_annotated"]],
        },
        { key: "group_by", kind: "select", label: "e_group_by", options: [["none", "e_group_none"], ["due_day", "e_group_day"]] },
        {
          key: "description",
          kind: "select",
          label: "e_description",
          options: [["always", "e_desc_always"], ["collapsed", "e_desc_collapsed"], ["hidden", "e_desc_hidden"]],
        },
        { key: "show_due", kind: "bool", label: "e_show_due" },
        { key: "show_header", kind: "bool", label: "e_show_header" },
        { key: "compact", kind: "bool", label: "e_compact" },
      ],
    },
    {
      fields: [
        { key: "skip", kind: "bool", label: "e_skip" },
        { key: "skip_label", kind: "text", label: "e_skip_label" },
        { key: "skip_format", kind: "text", label: "e_skip_format" },
      ],
    },
  ];

  private _field(f: Field): TemplateResult {
    const t = this._t;
    const cfg = this._config as unknown as Record<string, unknown>;
    const id = `f-${f.key}`;
    const def = (DEFAULTS as Record<string, unknown>)[f.key];
    if (f.kind === "bool") {
      const checked = (cfg[f.key] ?? def ?? false) as boolean;
      return html`<label class="row bool" for=${id}>
        <span>${t(f.label)}</span>
        <input id=${id} type="checkbox" role="switch" .checked=${checked} @change=${(e: Event) => this._set(f.key, (e.target as HTMLInputElement).checked)} />
      </label>`;
    }
    if (f.kind === "select") {
      const val = (cfg[f.key] ?? def) as string;
      return html`<label class="row" for=${id}>
        <span class="lbl">${t(f.label)}</span>
        <select id=${id} @change=${(e: Event) => this._set(f.key, (e.target as HTMLSelectElement).value)}>
          ${f.options.map(([v, l]) => html`<option value=${v} ?selected=${v === val}>${t(l)}</option>`)}
        </select>
      </label>`;
    }
    const placeholder = f.key === "skip_format" ? defaultSkipFormat(this.hass?.locale?.language ?? this.hass?.language) : (f.placeholder ?? "");
    return html`<label class="row" for=${id}>
      <span class="lbl">${t(f.label)}</span>
      <input
        id=${id}
        type="text"
        .value=${(cfg[f.key] as string | undefined) ?? ""}
        placeholder=${placeholder}
        @change=${(e: Event) => this._set(f.key, (e.target as HTMLInputElement).value)}
      />
    </label>`;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._config) return nothing;
    const t = this._t;
    const todos = Object.keys(this.hass?.states ?? {})
      .filter((e) => e.startsWith("todo."))
      .sort();
    const cur = this._config.entity ?? "";
    return html`
      <div class="editor">
        <label class="row" for="f-entity">
          <span class="lbl">${t("e_entity")}</span>
          <select id="f-entity" @change=${(e: Event) => this._set("entity", (e.target as HTMLSelectElement).value)}>
            ${cur && !todos.includes(cur) ? html`<option value=${cur} selected>${cur}</option>` : nothing}
            ${!cur ? html`<option value="" selected disabled>—</option>` : nothing}
            ${todos.map(
              (e) => html`<option value=${e} ?selected=${e === cur}>
                ${(this.hass!.states[e].attributes.friendly_name as string | undefined) ?? e} (${e})
              </option>`,
            )}
          </select>
        </label>
        ${TodoAnnotateCardEditor.SECTIONS.map((s) => html`<fieldset>${s.fields.map((f) => this._field(f))}</fieldset>`)}
      </div>
    `;
  }

  static styles = css`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 12px;
      color: var(--primary-text-color);
    }
    fieldset {
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3));
      border-radius: 12px;
      margin: 0;
      padding: 4px 12px;
      display: flex;
      flex-direction: column;
    }
    .row {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 8px 0;
    }
    .row.bool {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      min-height: 32px;
    }
    .lbl {
      font-size: 0.85rem;
      color: var(--secondary-text-color);
    }
    input[type="text"],
    select {
      font: inherit;
      font-size: 16px;
      color: var(--primary-text-color);
      background: var(--input-fill-color, var(--secondary-background-color, rgba(127, 127, 127, 0.08)));
      border: 1px solid var(--input-idle-line-color, var(--divider-color, rgba(127, 127, 127, 0.4)));
      border-radius: 8px;
      padding: 10px 12px;
      width: 100%;
      box-sizing: border-box;
    }
    input[type="checkbox"] {
      width: 20px;
      height: 20px;
      accent-color: var(--primary-color);
      flex: none;
    }
    input:focus-visible,
    select:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 1px;
    }
  `;
}

if (!customElements.get("todo-annotate-card-editor")) customElements.define("todo-annotate-card-editor", TodoAnnotateCardEditor);
