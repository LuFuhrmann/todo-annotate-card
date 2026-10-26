# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/).

## [1.0.0] – 2026-10-26

### Added
- To-do list card with two checkboxes per item: **Done** (item status) and a configurable second checkbox (e.g. “Deviation”, “Note”).
- Second checkbox opens an inline editor; saving stores the note as one formatted line in the item description (default `❗ Abweichung: {text}`) and optionally marks the item done. The summary is never changed.
- Annotated items show the marker and only the note; tapping reveals the original description. Notes can be edited and removed.
- Options: entity, title, label/icon/marker, storage format, line separator, auto-complete, behaviour on removal, multi-line input, show/hide completed, completed section, sorting (list order, alphabetical, due, annotated first), grouping by due day, description display (always / on tap / hidden), due date, legend, compact mode.
- Live updates via `todo/item/subscribe`, writes via `todo.update_item`; feature check for lists without description support.
- Visual editor, English and German UI (follows the Home Assistant language), theme variables and dark mode, keyboard and screen reader support, no external runtime dependencies.
