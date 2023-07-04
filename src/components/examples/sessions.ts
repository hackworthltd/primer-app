import { v4 as uuidv4 } from "uuid";

import type { Session } from "@/primer-api";

export const englishSession: Session = {
  id: uuidv4(),
  name: "Example program",
  lastModified: new Date("2021-08-15T23:17:50.918Z"),
};

export const japaneseSession: Session = {
  id: uuidv4(),
  name: "サンプルプログラム",
  lastModified: new Date("2021-08-07T10:12:03.332Z"),
};

export const simplifiedChineseSession: Session = {
  id: uuidv4(),
  name: "示例程序",
  lastModified: new Date("2021-07-10T09:00:01.000Z"),
};

export const arabicSession: Session = {
  id: uuidv4(),
  name: "برنامج مثال",
  lastModified: new Date("2021-08-20T03:20:59.999Z"),
};

export const emojiSession: Session = {
  id: uuidv4(),
  name: "😄😂🤣🤗 🦊 🦈",
  lastModified: new Date("2021-07-23T11:53:13.730Z"),
};

export const exampleSessions = (): Session[] => {
  return [
    englishSession,
    japaneseSession,
    simplifiedChineseSession,
    arabicSession,
    emojiSession,
    {
      id: uuidv4(),
      name: "Map test",
      lastModified: new Date("2021-08-15T23:17:50.918Z"),
    },
    {
      id: uuidv4(),
      name: "Just playing around",
      lastModified: new Date("2021-08-07T10:12:03.332Z"),
    },
    {
      id: uuidv4(),
      name: "Exercise 2.3(b)",
      lastModified: new Date("2021-07-10T09:00:01.000Z"),
    },
    {
      id: uuidv4(),
      name: "Not yet working",
      lastModified: new Date("2021-08-20T03:20:59.999Z"),
    },
  ];
};
