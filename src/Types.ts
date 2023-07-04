// Abstract avatar styles.
export type AvatarStyle = "bottts" | "identicon";

// Placeholder account type.
export interface Account {
  id: string;
  avatarStyle: AvatarStyle;
}
