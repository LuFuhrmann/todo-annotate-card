# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/).

## [1.2.0] – 2026-10-27

### Added
- Optional dish catalog from an entity's attributes (`dishes_entity`, attribute `dishes` or `gerichte`; optional `punkte` with planned dish and day type per item). Off unless configured; existing cards are unchanged.
- ⇄ **Change dish** for open items (`replan`, `replan_label`): pick a dish that fits the item's slot (`dish_slot_pattern`, default: text after the time in the summary). The description gets `🔁 Chosen/Gewählt: Name [id]`, the dish text with kcal, protein and time, and `↩ Planned/Plan:` with the original description; **Back to the plan** restores it. Dishes for the item's day type are listed first; the planned one is marked.
- Dish list in the note editor (`dish_in_note`); the note is stored as `[id] Name / text` and shown without the id. Free text still works.
- Visual editor fields and German/English texts for the new options.

## [1.1.0] – 2026-10-26

### Fixed
- Typed notes are no longer discarded when the note checkbox is tapped again, when another item’s editor is opened, or when the item is marked done. Only **Cancel** drops the edit, and the text is kept as a draft in `localStorage` (per list and item) until a successful save. While the editor is open the checkbox is indeterminate and shows “Not saved yet” / “Noch nicht gespeichert”.

### Added
- Optional third checkbox **Skipped** (`skip: true`, default off). `skip_label` defaults to “Skipped” / “Ausgelassen”. `skip_format` defaults to `⊘ Skipped` or `⊘ Ausgelassen` depending on the Home Assistant language; a template with `{text}` asks for a reason (for example `⊘ Ausgelassen: {text}`).
- The skip line is stored in the description and the summary is unchanged. Setting skipped marks the item done and removes a note (after confirmation when note text exists). Unchecking skipped leaves the item done. Unchecking done removes the skip line. Skipped items show `⊘` and the name in grey, plus a hint and any reason; the plan opens on tap.

## [1.0.0] – 2026-10-26

### Added
- To-do list card with two checkboxes per item: **Done** (item status) and a configurable second checkbox (e.g. “Deviation”, “Note”).
- Second checkbox opens an inline editor; saving stores the note as one formatted line in the item description (default `❗ Abweichung: {text}`) and optionally marks the item done. The summary is never changed.
- Annotated items show the marker and only the note; tapping reveals the original description. Notes can be edited and removed.
- Options: entity, title, label/icon/marker, storage format, line separator, auto-complete, behaviour on removal, multi-line input, show/hide completed, completed section, sorting (list order, alphabetical, due, annotated first), grouping by due day, description display (always / on tap / hidden), due date, legend, compact mode.
- Live updates via `todo/item/subscribe`, writes via `todo.update_item`; feature check for lists without description support.
- Visual editor, English and German UI (follows the Home Assistant language), theme variables and dark mode, keyboard and screen reader support, no external runtime dependencies.
