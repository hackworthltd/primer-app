import { ComponentStory, ComponentMeta } from "@storybook/react";

import type { Size, BrandingProps } from "./";
import { Branding } from "./";

const allSizes: Array<Size> = ["responsive", "sm", "md", "lg", "xl", "2xl"];
const fixedSizes: Array<Size> = ["sm", "md", "lg", "xl", "2xl"];

export default {
  title: "Application/Component Library/Branding/Primer",
  component: Branding,
  argTypes: {
    size: {
      description: "Pre-defined sizes.",
      options: allSizes,
      control: { type: "radio" },
    },
  },
} as ComponentMeta<typeof Branding>;

const Template: ComponentStory<typeof Branding> = (args: BrandingProps) => (
  <Branding {...args} />
);

export const Single = Template.bind({});
Single.args = {
  size: "responsive",
};

const AllSizesTemplate: ComponentStory<typeof Branding> = () => (
  <>
    <div className="mb-8 flex flex-row items-center justify-around">
      {fixedSizes.map((sz) => (
        <Branding size={sz} key={sz} />
      ))}
    </div>
  </>
);

export const Showcase = AllSizesTemplate.bind({});
