export interface TodoItem {
  uid: string;
  summary: string;
  status: "needs_action" | "completed";
  description?: string | null;
  due?: string | null;
}

export type SortMode = "manual" | "alpha" | "due" | "annotated_first";
export type DescriptionMode = "always" | "collapsed" | "hidden";

export interface TodoAnnotateCardConfig {
  type: string;
  entity: string;
  title?: string;
  annotation_label?: string;
  annotation_icon?: string;
  marker?: string;
  format?: string;
  separator?: string;
  auto_complete?: boolean;
  on_remove?: "keep" | "reopen";
  multiline?: boolean;
  show_completed?: boolean;
  completed_section?: boolean;
  sort?: SortMode;
  group_by?: "none" | "due_day";
  description?: DescriptionMode;
  show_due?: boolean;
  compact?: boolean;
  show_header?: boolean;
}

// Minimal subset of the Home Assistant frontend `hass` object used by the card.
export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown> & { friendly_name?: string; supported_features?: number };
}
export interface HomeAssistant {
  states: Record<string, HassEntity>;
  language?: string;
  locale?: { language: string };
  themes?: { darkMode?: boolean };
  connection: {
    subscribeMessage<T>(cb: (msg: T) => void, msg: Record<string, unknown>): Promise<() => Promise<void> | void>;
  };
  callService(domain: string, service: string, data?: Record<string, unknown>, target?: Record<string, unknown>): Promise<unknown>;
}

/** homeassistant.components.todo.TodoListEntityFeature */
export const TodoFeature = {
  CREATE_TODO_ITEM: 1,
  DELETE_TODO_ITEM: 2,
  UPDATE_TODO_ITEM: 4,
  MOVE_TODO_ITEM: 8,
  SET_DUE_DATE_ON_ITEM: 16,
  SET_DUE_DATETIME_ON_ITEM: 32,
  SET_DESCRIPTION_ON_ITEM: 64,
} as const;
