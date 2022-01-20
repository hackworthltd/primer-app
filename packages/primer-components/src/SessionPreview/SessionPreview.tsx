import "@/index.css";

import { Link } from "react-router-dom";

import { SessionMeta } from "@hackworthltd/primer-types";
import { BinaryTreePlaceholder } from "@/BinaryTreePlaceholder/BinaryTreePlaceholder";

export interface SessionPreviewProps {
  session: SessionMeta;
}

export const SessionPreview = ({
  session,
}: SessionPreviewProps): JSX.Element => {
  const locale: string = navigator.language;
  return (
    <div>
      <Link to={`/sessions/${session.id}`} key={session.id}>
        <div className="group flex overflow-hidden flex-row justify-center w-full max-w-md bg-grey-primary rounded-lg">
          <BinaryTreePlaceholder className="w-16 md:w-48 h-16 md:h-48 text-white-primary group-hover:text-blue-primary fill-current" />
        </div>
      </Link>
      <p className="block mt-2 text-sm font-medium text-blue-primary truncate pointer-events-none">
        {session.name}
      </p>
      <p className="block text-sm font-medium text-blue-primary pointer-events-none">
        {new Intl.DateTimeFormat(locale, {
          dateStyle: "medium",
          timeStyle: "medium",
        }).format(session.lastModified)}
      </p>
    </div>
  );
};
