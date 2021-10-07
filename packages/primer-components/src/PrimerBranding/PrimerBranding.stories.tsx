import { ComponentStory, ComponentMeta } from "@storybook/react";

import type { Size, PrimerBrandingProps } from "./PrimerBranding";
import { PrimerBranding } from "./PrimerBranding";

const sizes: Array<Size> = ["sm", "md", "lg", "xl", "2xl"];

export default {
  title: "Application/Component Library/Branding/Primer",
  component: PrimerBranding,
  argTypes: {
    size: {
      description: "Pre-defined sizes.",
      options: sizes,
      control: { type: "radio" },
    },
  },
} as ComponentMeta<typeof PrimerBranding>;

const Template: ComponentStory<typeof PrimerBranding> = (
  args: PrimerBrandingProps
) => <PrimerBranding {...args} />;

export const Single = Template.bind({});
Single.args = {
  size: "xl",
};

const AllSizesTemplate: ComponentStory<typeof PrimerBranding> = () => (
  <>
    <div className="flex flex-row justify-around items-center mb-8">
      {sizes.map((sz) => (
        <PrimerBranding size={sz} key={sz} />
      ))}
    </div>
  </>
);

export const Showcase = AllSizesTemplate.bind({});
