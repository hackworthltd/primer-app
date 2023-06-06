import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { SelectMenu } from "./";

const meta: Meta<typeof SelectMenu> = {
  title: "Application/Component Library/SelectMenu",
  component: SelectMenu,
};

export default meta;
type Story = StoryObj<typeof SelectMenu>;

const MenuWithHooks = () => {
  const [selected, setSelected] = useState("myOtherDefinition");
  return (
    <SelectMenu
      label="Evaluate"
      selected={selected}
      options={[
        "myDefinition",
        "myOtherDefinition",
        "Something else",
        "identity",
        "map",
        "filter",
        "reduce",
        "a really really really really really long definition name",
        "fold",
        "foldl",
        "foldr",
        "foldl'",
        "foldr'",
      ]}
      optionType="code"
      onChange={(selection) => setSelected(selection)}
    />
  );
};

export const Default: Story = {
  render: () => <MenuWithHooks />,
};
