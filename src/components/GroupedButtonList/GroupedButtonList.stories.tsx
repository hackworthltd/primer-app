import { ComponentStory, ComponentMeta } from "@storybook/react";

import { GroupedButtonList } from "./";

export default {
  title: "Application/Component Library/GroupedButtonList",
  component: GroupedButtonList,
  argTypes: {
    compact: { control: "boolean", name: "Pack buttons closely?" },
    expanded: { control: "boolean", name: "Start with dropdowns open?" },
    groups: { control: "object", name: "List of action groups" },
  },
} as ComponentMeta<typeof GroupedButtonList>;

const Template: ComponentStory<typeof GroupedButtonList> = (args) => (
  <>
    {/*
     Let's replace this background color hack with a proper
     component. See:
     https://github.com/hackworthltd/primer-app/issues/140
     */}
    <div className="w-1/2 bg-grey-primary p-8">
      <GroupedButtonList {...args} />
    </div>
  </>
);

export const Examples = Template.bind({});
Examples.args = {
  groups: [
    {
      heading: "Months, short",
      actions: [
        { label: "Jan" },
        { label: "Feb" },
        { label: "Mar" },
        { label: "Apr" },
        { label: "May" },
        { label: "Jun" },
        { label: "Jul" },
        { label: "Aug" },
        { label: "Sep" },
        { label: "Oct" },
        { label: "Nov" },
        { label: "Dec" },
      ],
    },
    {
      heading: "Months, long",
      actions: [
        { label: "January" },
        { label: "Febuary" },
        { label: "March" },
        { label: "April" },
        { label: "May" },
        { label: "June" },
        { label: "July" },
        { label: "August" },
        { label: "September" },
        { label: "October" },
        { label: "November" },
        { label: "December" },
      ],
    },
    // A mix of different length labels
    {
      heading: "Colors",
      actions: [
        { label: "Red" },
        { label: "Blue" },
        { label: "Magenta" },
        { label: "Burnt Ochre" },
        { label: "Rust" },
        { label: "Pink" },
        { label: "Eggshell" },
        { label: "Grey" },
        { label: "Blanched Almond" },
      ],
    },
  ],
};
