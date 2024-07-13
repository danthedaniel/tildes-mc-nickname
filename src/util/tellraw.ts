export function tellRawString(text: TextComponent): string {
  return JSON.stringify(text);
}

/**
 * Represents a Minecraft text component which can be a plain string, an object with various styling and interaction options, or an array of these elements.
 */
export type TextComponent = string | TextObject | (string | TextObject)[];

/**
 * Describes a text object in Minecraft"s JSON text formatting system, capable of nesting other text components, applying styling, and including interactive events.
 */
interface TextObject {
  /** 
   * Plain text to be displayed. 
   */
  text?: string;
  /** 
   * List of additional text components that are displayed in sequence after this component.
   */
  extra?: TextComponent[];
  /** 
   * Specifies the color of the text. Accepts named colors or hexadecimal values prefixed by "#".
   */
  color?: `#${string}` | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white";
  /** 
   * Font resource location to use for rendering the text.
   */
  font?: string;
  /** 
   * Renders the text in bold.
   */
  bold?: boolean;
  /** 
   * Renders the text in italics.
   */
  italic?: boolean;
  /** 
   * Underlines the text.
   */
  underlined?: boolean;
  /** 
   * Strikes through the text.
   */
  strikethrough?: boolean;
  /** 
   * Renders the text with a scrambling effect that makes it unreadable.
   */
  obfuscated?: boolean;
  /** 
   * Text that gets inserted into the chat input when the component is shift-clicked.
   */
  insertion?: string;
  /** 
   * Describes an interaction that occurs when the component is clicked.
   */
  clickEvent?: ClickEvent;
  /** 
   * Describes an interaction that occurs when the component is hovered over.
   */
  hoverEvent?: HoverEvent;
}

/**
 * Defines the click event associated with a text component, specifying the action to perform and its value when the text is clicked.
 */
interface ClickEvent {
  /** 
   * The type of action that will occur when the text is clicked.
   */
  action: "open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard";
  /** 
   * The value associated with the action, such as a URL or command string.
   */
  value: string;
}

/**
 * Defines the hover event associated with a text component, specifying the type of tooltip to display when the mouse hovers over the text.
 */
interface HoverEvent {
  /** 
   * The type of tooltip that is displayed when hovering over the text.
   */
  action: "show_text" | "show_item" | "show_entity";
  /** 
   * The content of the tooltip, varying based on the action specified.
   */
  contents: HoverContent;
}

/**
 * Content definitions for hover tooltips based on the action.
 */
type HoverContent = TextComponent | ShowItem | ShowEntity;

/**
 * Specifies the details of an item tooltip to be shown.
 */
interface ShowItem {
  /** 
   * The item"s identifier.
   */
  id: string;
  /** 
   * The count of items to display in the tooltip.
   */
  count?: number;
  /** 
   * Additional data about the item, formatted as a string containing serialized NBT.
   */
  tag?: string;
}

/**
 * Specifies the details of an entity tooltip to be shown.
 */
interface ShowEntity {
  /** 
   * The display name of the entity, shown if provided.
   */
  name?: string;
  /** 
   * The type identifier of the entity.
   */
  type: string;
  /** 
   * The unique identifier of the entity.
   */
  id: string;
}
