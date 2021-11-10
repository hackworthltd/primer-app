import "@/index.css";

import { SessionMeta } from "@hackworthltd/primer-types";
import { BinaryTreePlaceholder } from "@/BinaryTreePlaceholder/BinaryTreePlaceholder";

interface SessionPreviewProps {
  session: SessionMeta;
}

export const SessionPreview = ({
  session,
}: SessionPreviewProps): JSX.Element => {
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
};
