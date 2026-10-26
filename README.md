# Todo Annotate Card

A Home Assistant dashboard card for to-do lists that adds a **second checkbox** to every item.
Tick it to attach a short note, e.g. a *deviation* from a meal plan, a *problem* during a chore, or a *substitute* on a shopping list.
The note is merged into the item, the item is marked with ❗ (configurable) and shows only the note.
Tap the item to see the original description again.

[![hacs][hacs-badge]][hacs-url] ![version](https://img.shields.io/badge/version-1.0.0-blue) ![license](https://img.shields.io/badge/license-MIT-green)

*Deutsch: siehe [unten](#deutsch).*

| Light | Dark | Note editor |
|---|---|---|
| ![Light](screenshots/demo-hell-1-uebersicht.png) | ![Dark, expanded](screenshots/demo-dunkel-2-aufgeklappt.png) | ![Editor](screenshots/demo-hell-3-eingabe.png) |

## Features
- Two checkboxes per item: **Done** (the normal to-do status) and a configurable second one (label, icon, marker).
- Inline note editor (single- or multi-line). Saving keeps the original description, appends one formatted line and can mark the item done. **The item summary is never changed**, so automations or scripts can keep using it as a key.
- Annotated items show marker + note only; the original description expands on tap. Notes can be edited or removed (removing returns the item to normal).
- Works with any `todo.*` entity whose integration can edit descriptions (e.g. **Local To-do**). Lists without description support show a clear message.
- Live updates (`todo/item/subscribe`), writes via the `todo.update_item` action.
- Sorting, grouping by due day, hide or separate completed items, compact mode.
- Visual editor, English and German (follows your Home Assistant language), theme colours and dark mode, 44 px touch targets for the mobile app, keyboard and screen reader support.
- No external runtime dependencies, no CDN, one small JS file. All text is rendered as text (no HTML injection).

## Installation

### HACS (custom repository)
1. HACS → ⋮ → **Custom repositories** → add `https://github.com/LuFuhrmann/todo-annotate-card`, category **Dashboard**.
2. Search for **Todo Annotate Card**, download it.
3. Reload the browser (in the Companion app: Settings → Companion app → Debugging → *Reset frontend cache*).

HACS adds the dashboard resource automatically.

### Manual
1. Download `todo-annotate-card.js` from the [latest release](https://github.com/LuFuhrmann/todo-annotate-card/releases) (or `dist/`).
2. Copy it to `/config/www/todo-annotate-card.js`.
3. Settings → Dashboards → ⋮ → **Resources** → add `/local/todo-annotate-card.js?v=1.0.0`, type **JavaScript module**. Increase `?v=` after every update.

## Configuration
Add the card from the card picker (**Todo Annotate Card**) or use YAML:

```yaml
type: custom:todo-annotate-card
entity: todo.meal_plan
```

| Option | Type | Default | Description |
|---|---|---|---|
| `entity` | string | **required** | A `todo.*` entity. |
| `title` | string | entity name | Card title. Set `""` to hide. |
| `annotation_label` | string | `Note` / `Anmerkung` | Label of the second checkbox (legend, ARIA, buttons). |
| `annotation_icon` | string | `mdi:alert-circle-outline` | Icon next to the second checkbox when the legend is hidden. |
| `marker` | string | `❗` | Shown in front of annotated items. `""` for none. |
| `format` | string | `❗ Abweichung: {text}` | Line stored in the description. Must contain `{text}` once and no line break. |
| `separator` | string | `" / "` | Joins lines of multi-line input in the stored line. |
| `auto_complete` | bool | `true` | Saving a note marks the item done. |
| `on_remove` | `keep` \| `reopen` | `keep` | Status after removing a note. |
| `multiline` | bool | `true` | Textarea (Ctrl/⌘+Enter saves) instead of a single-line field (Enter saves). |
| `show_completed` | bool | `true` | Show completed items. |
| `completed_section` | bool | `false` | Put completed items into their own section at the bottom. |
| `sort` | `manual` \| `alpha` \| `due` \| `annotated_first` | `manual` | Sort order (`manual` = order of the list). |
| `group_by` | `none` \| `due_day` | `none` | Group items by the day they are due. |
| `description` | `always` \| `collapsed` \| `hidden` | `always` | Description of items *without* a note. Annotated items always show the note and reveal the description on tap. |
| `show_due` | bool | `true` | Show due date/time. |
| `show_header` | bool | `true` | Show the legend explaining the two checkboxes. |
| `compact` | bool | `false` | Denser layout. |

### Examples
Meal plan with deviations, grouped by day (German UI):
```yaml
type: custom:todo-annotate-card
entity: todo.essensplan_woche
title: Mahlzeiten
annotation_label: Abweichung
group_by: due_day
show_due: false
```

Chores with a “problem” note, open items only:
```yaml
type: custom:todo-annotate-card
entity: todo.chores
annotation_label: Problem
marker: "⚠️"
format: "⚠️ Problem: {text}"
show_completed: false
sort: due
```

Shopping list with substitutes, notes do not tick the item:
```yaml
type: custom:todo-annotate-card
entity: todo.shopping_list_local
annotation_label: Substitute
marker: "🔁"
format: "🔁 Substitute: {text}"
auto_complete: false
multiline: false
description: hidden
```

## How notes are stored
The note is one line inside the item description, built from `format`:

```
Porridge with banana            ← original description (kept)
22 g protein · 650 kcal
❗ Abweichung: Pizza with colleagues / plus a soda
```

- Exactly one note line per item; saving again replaces it, removing deletes it.
- Parsing tolerates extra whitespace and CRLF; the last matching line wins.
- Because it is plain text, the note stays visible in the standard to-do card, the mobile app and in automations (`todo.get_items`). Other tools can parse it with the same pattern, e.g. Python: `re.match(r"^\s*❗\s*Abweichung\s*:\s*(.*)$", line)`.
- Changing `format` later does not convert existing notes. Keep it stable if other tools read the notes.

## Compatibility
- Home Assistant 2024.1 or newer (to-do item descriptions and `todo/item/subscribe`).
- Integrations: anything that supports *update item* and *set description* (e.g. Local To-do, CalDAV). Lists without description support (e.g. the classic Shopping list) show a message and the second checkbox is disabled.

## Accessibility
Native checkboxes with labels, `aria-expanded` on expandable items, visible focus rings, Escape closes the editor, Enter / Ctrl+Enter saves, colours from your theme.

## Development
```bash
npm ci
npm run typecheck
npm test               # unit tests (parsing/merging, sorting/grouping)
npm run build          # dist/todo-annotate-card.js
npm run screenshots    # headless render + interaction test with a mocked hass (needs Chrome/Chromium, CHROME_PATH)
```

## License
[MIT](LICENSE)

---

## Deutsch
**Todo Annotate Card** ergänzt jeden To-do-Punkt um eine **zweite Checkbox**, z. B. „Abweichung“.
Hakst du sie an, öffnet sich ein Eingabefeld. Nach dem Speichern wird der Punkt als erledigt markiert (abschaltbar), mit ❗ gekennzeichnet und zeigt nur noch deinen Text.
Die ursprüngliche Beschreibung erscheint erst, wenn du den Punkt antippst. Die Anmerkung kannst du bearbeiten oder entfernen; danach ist der Punkt wieder normal.

- Funktioniert mit jeder `todo.*`-Liste, die Beschreibungen bearbeiten kann (z. B. **Lokale To-do-Liste**).
- Gespeichert wird eine Zeile in der Beschreibung, Standard `❗ Abweichung: <Text>`. Der Name (summary) des Punkts wird **nie** geändert.
- Mehrzeilige Eingaben werden mit ` / ` zu einer Zeile verbunden.
- Oberfläche auf Deutsch oder Englisch, je nach HA-Sprache; visueller Karten-Editor; hell/dunkel; gut bedienbar in der HA-App am Handy.

Installation: HACS → ⋮ → *Benutzerdefinierte Repositories* → Repository-URL, Kategorie **Dashboard** → herunterladen. Manuell: Datei nach `/config/www/` kopieren und unter *Einstellungen → Dashboards → Ressourcen* als `/local/todo-annotate-card.js?v=1.0.0` (JavaScript-Modul) eintragen.

[hacs-badge]: https://img.shields.io/badge/HACS-Custom-41BDF5.svg
[hacs-url]: https://hacs.xyz/docs/faq/custom_repositories
