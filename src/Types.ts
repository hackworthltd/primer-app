// Abstract avatar styles.
export type AvatarStyle = "bottts" | "identicon";

// Placeholder account type.
export interface Account {
  name: string;
  email: string;
  avatarStyle: AvatarStyle;
  imageUrl: string | undefined;
}

// Placeholder type for our backend session type.
export interface SessionMeta {
  id: string;
  name: string;
  lastModified: Date;
}
