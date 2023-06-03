import { ComponentStory, ComponentMeta } from "@storybook/react";

import { zipWith } from "fp-ts/Array";
import type { AvatarStyle } from "@/Types";
import type { Size, Decoration, AvatarProps } from "./";
import { Avatar } from "./";

const ids: string[] = [
  "student1@gmail.com",
  "student2@gmail.com",
  "student3@gmail.com",
  "student4@gmail.com",
  "student5@gmail.com",
];

const imgSrcs: (string | undefined)[] = [
  "https://images.unsplash.com/photo-1589729132389-8f0e0b55b91e?ixid=MnwyNjcwMzh8MHwxfGFsbHx8fHx8fHx8fDE2MzQwNTU1OTA&ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1589525231707-f2de2428f59c?ixid=MnwyNjcwMzh8MHwxfGFsbHx8fHx8fHx8fDE2MzQwNTUxMjg&ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1573496358961-3c82861ab8f4?ixid=MnwyNjcwMzh8MHwxfGFsbHx8fHx8fHx8fDE2MzQwNTU4MjU&ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1514222709107-a180c68d72b4?ixid=MnwyNjcwMzh8MHwxfGFsbHx8fHx8fHx8fDE2MzQwNTU4ODI&ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixid=MnwyNjcwMzh8MHwxfGFsbHx8fHx8fHx8fDE2MzQwNTU5MzQ&ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
];

const allDecorations: Decoration[] = ["plain", "alert"];
const allStyles: AvatarStyle[] = ["identicon", "bottts"];
const allSizes: Size[] = ["responsive", "sm", "md", "lg", "xl", "2xl"];
const fixedSizes: Size[] = ["sm", "md", "lg", "xl", "2xl"];

export default {
  title: "Application/Component Library/Avatar",
  component: Avatar,
  argTypes: {
    size: {
      description: "Pre-defined sizes.",
      options: allSizes,
      control: { type: "radio" },
    },
    id: {
      description: "The student's ID.",
    },
    decoration: {
      description: "A deocration for the avatar.",
      options: allDecorations,
      control: { type: "radio" },
    },
    style: {
      description: "The student's chosen avatar style.",
      options: allStyles,
      control: { type: "radio" },
    },
    imgSrc: {
      description: "The student's uploaded image (optional).",
      options: imgSrcs,
      control: { type: "radio" },
    },
  },
} as ComponentMeta<typeof Avatar>;

const Template: ComponentStory<typeof Avatar> = (args: AvatarProps) => (
  <Avatar {...args} />
);

export const Single = Template.bind({});
Single.args = {
  id: "student1@gmail.com",
  style: "identicon",
  imgSrc: undefined,
  decoration: "plain",
  size: "responsive",
};

const zipSizeIDs: [Size, string][] = zipWith(fixedSizes, ids, (sz, id) => [
  sz,
  id,
]);
const zipSizeImgSrcs: [Size, string | undefined][] = zipWith(
  fixedSizes,
  imgSrcs,
  (sz, imgSrc) => [sz, imgSrc]
);

const AllButtonsTemplate: ComponentStory<typeof Avatar> = () => (
  <>
    <h1 className="text-xl">Identicon</h1>
    <div className="mb-8 flex flex-row items-center justify-around">
      {zipSizeIDs.map(([sz, id]) => (
        <Avatar
          id={id}
          style="identicon"
          imgSrc={undefined}
          decoration="plain"
          size={sz}
          key={sz}
        />
      ))}
    </div>

    <h1 className="text-xl">Bottts</h1>
    <div className="mb-8 flex flex-row items-center justify-around">
      {zipSizeIDs.map(([sz, id]) => (
        <Avatar
          id={id}
          style="bottts"
          imgSrc={undefined}
          decoration="plain"
          size={sz}
          key={sz}
        />
      ))}
    </div>

    <h1 className="text-xl">Image</h1>
    <div className="mb-8 flex flex-row items-center justify-around">
      {zipSizeImgSrcs.map(([sz, imgSrc]) => (
        <Avatar
          id="student1@gmail.com"
          style="identicon"
          imgSrc={imgSrc}
          decoration="plain"
          size={sz}
          key={sz}
        />
      ))}
    </div>
  </>
);

export const Showcase = AllButtonsTemplate.bind({});

const AllButtonsWithAlertTemplate: ComponentStory<typeof Avatar> = () => (
  <>
    <h1 className="text-xl">Identicon with alert</h1>
    <div className="mb-8 flex flex-row items-center justify-around">
      {zipSizeIDs.map(([sz, id]) => (
        <Avatar
          id={id}
          style="identicon"
          imgSrc={undefined}
          decoration="alert"
          size={sz}
          key={sz}
        />
      ))}
    </div>

    <h1 className="text-xl">Bottts with alert</h1>
    <div className="mb-8 flex flex-row items-center justify-around">
      {zipSizeIDs.map(([sz, id]) => (
        <Avatar
          id={id}
          style="bottts"
          imgSrc={undefined}
          decoration="alert"
          size={sz}
          key={sz}
        />
      ))}
    </div>

    <h1 className="text-xl">Image with alert</h1>
    <div className="mb-8 flex flex-row items-center justify-around">
      {zipSizeImgSrcs.map(([sz, imgSrc]) => (
        <Avatar
          id="student1@gmail.com"
          style="identicon"
          imgSrc={imgSrc}
          decoration="alert"
          size={sz}
          key={sz}
        />
      ))}
    </div>
  </>
);

export const ShowcaseWithAlert = AllButtonsWithAlertTemplate.bind({});
