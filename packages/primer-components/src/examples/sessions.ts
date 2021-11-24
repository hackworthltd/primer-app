import { v4 as uuidv4 } from "uuid";
import type { SessionMeta } from "@hackworthltd/primer-types";

export const exampleSessionsMeta = (): SessionMeta[] => {
  const id1: string = uuidv4();
  const id2: string = uuidv4();
  const id3: string = uuidv4();
  const id4: string = uuidv4();
  const id5: string = uuidv4();

  return [
    {
      id: id1,
      name: "Map test",
      lastModified: new Date("2021-08-15T23:17:50.918Z"),
    },
    {
      id: id2,
      name: "Just playing around",
      lastModified: new Date("2021-08-07T10:12:03.332Z"),
    },
    {
      id: id3,
      name: "😄😂🤣🤗 🦊 🦈",
      lastModified: new Date("2021-07-23T11:53:13.730Z"),
    },
    {
      id: id4,
      name: "Exercise 2.3(b)",
      lastModified: new Date("2021-07-10T09:00:01.000Z"),
    },
    {
      id: id5,
      name: "Not yet working",
      lastModified: new Date("2021-08-20T03:20:59.999Z"),
    },
  ];
};
