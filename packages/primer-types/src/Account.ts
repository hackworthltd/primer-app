// Abstract avatar styles.
export type AvatarStyle = "bottts" | "identicon" | "jdenticon";

// Placeholder account type.
export interface Account {
  name: string;
  email: string;
  avatarStyle: AvatarStyle;
  imageUrl: string | undefined;
}
