import React from "react";
import "./SessionPreview.css";
import { BinaryTreePlaceholder } from "../BinaryTreePlaceholder/BinaryTreePlaceholder";

export interface SessionMeta {
  id: string;
  name: string;
  lastModified: Date;
  url: string;
}

interface SessionPreviewProps {
  session: SessionMeta;
}

export function SessionPreview({ session }: SessionPreviewProps) {
  const locale: string = navigator.language;
  return (
    <div>
      <a href={session.url}>
        <div className="group flex overflow-hidden flex-row justify-center w-full max-w-md bg-gray-100 rounded-lg">
          <BinaryTreePlaceholder className="w-16 md:w-48 h-16 md:h-48 text-white group-hover:text-indigo-900 fill-current" />
        </div>
      </a>
      <p className="block mt-2 text-sm font-medium text-gray-900 truncate pointer-events-none">
        {session.name}
      </p>
      <p className="block text-sm font-medium text-gray-500 pointer-events-none">
        {new Intl.DateTimeFormat(locale, {
          dateStyle: "medium",
          timeStyle: "medium",
        }).format(session.lastModified)}
      </p>
    </div>
  );
}
