import "@/index.css";

import { Link } from "react-router-dom";

import { SessionMeta } from "@/Types";
import { BinaryTreePlaceholder } from "@/components";

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
        <div className="group flex w-full max-w-md flex-row justify-center overflow-hidden rounded-lg bg-grey-primary">
          <BinaryTreePlaceholder className="h-16 w-16 fill-current text-white-primary group-hover:text-blue-primary md:h-48 md:w-48" />
        </div>
      </Link>
      <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-blue-primary">
        {session.name}
      </p>
      <p className="pointer-events-none block text-sm font-medium text-blue-primary">
        {new Intl.DateTimeFormat(locale, {
          dateStyle: "medium",
          timeStyle: "medium",
        }).format(session.lastModified)}
      </p>
    </div>
  );
};
