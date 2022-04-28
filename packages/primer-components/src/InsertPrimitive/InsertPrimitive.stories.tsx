import { ComponentStory, ComponentMeta } from "@storybook/react";
import { InsertPrimitive } from "./InsertPrimitive";

export default {
  title: "Application/Component Library/InsertPrimitive",
  component: InsertPrimitive,
} as ComponentMeta<typeof InsertPrimitive>;

export const Default: ComponentStory<typeof InsertPrimitive> = () => (
  <InsertPrimitive />
);
