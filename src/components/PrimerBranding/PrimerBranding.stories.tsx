import { ComponentStory, ComponentMeta } from "@storybook/react";

import type { Size, PrimerBrandingProps } from "./";
import { PrimerBranding } from "./";

const allSizes: Array<Size> = ["responsive", "sm", "md", "lg", "xl", "2xl"];
const fixedSizes: Array<Size> = ["sm", "md", "lg", "xl", "2xl"];

export default {
  title: "Application/Component Library/Branding/Primer",
  component: PrimerBranding,
  argTypes: {
    size: {
      description: "Pre-defined sizes.",
      options: allSizes,
      control: { type: "radio" },
    },
  },
} as ComponentMeta<typeof PrimerBranding>;

const Template: ComponentStory<typeof PrimerBranding> = (
  args: PrimerBrandingProps
) => <PrimerBranding {...args} />;

export const Single = Template.bind({});
Single.args = {
  size: "responsive",
};

const AllSizesTemplate: ComponentStory<typeof PrimerBranding> = () => (
  <>
    <div className="mb-8 flex flex-row items-center justify-around">
      {fixedSizes.map((sz) => (
        <PrimerBranding size={sz} key={sz} />
      ))}
    </div>
  </>
);

export const Showcase = AllSizesTemplate.bind({});
