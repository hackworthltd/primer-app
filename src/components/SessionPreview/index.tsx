import "@/index.css";

import { StarIcon, TrashIcon, UserPlusIcon } from "@heroicons/react/24/outline";

import type { Key } from "react";
import { Link } from "react-router-dom";

import { SessionMeta } from "@/Types";
import { BinaryTreePlaceholder } from "@/components";

export interface SessionPreviewProps {
  session: SessionMeta;
  key: Key;
}

// Note: `SessionPreview` is implemented as a <li> for reasons explained in
// `SessionList.ts`. This is fine for now, as we only display session previews
// in the sessions list, but we would prefer that this type were more generic.

export const SessionPreview = ({
  session,
  key,
}: SessionPreviewProps): JSX.Element => {
  const locale: string = navigator.language;
  return (
    <li
      key={key}
      className="col-span-1 flex flex-col divide-y divide-grey-quaternary rounded-lg bg-white-primary text-center drop-shadow-md"
    >
      <div className="flex flex-1 flex-col">
        <Link
          to={`/sessions/${session.id}`}
          key={session.id}
          className="group rounded-t-lg hover:text-blue-primary"
        >
          <BinaryTreePlaceholder className="mx-auto h-16 w-16 shrink-0 fill-current text-white-primary group-hover:text-blue-primary md:h-48 md:w-48" />
        </Link>
        <h3 className="mt-6 truncate font-medium text-blue-primary">
          {session.name}
        </h3>
        <dl className="mt-1 flex grow flex-col justify-between">
          <dt className="sr-only">Last modified</dt>
          <dd className="text-xs text-blue-primary">
            {new Intl.DateTimeFormat(locale, {
              dateStyle: "medium",
              timeStyle: "medium",
            }).format(session.lastModified)}
          </dd>
          <dt className="sr-only">Tags</dt>
          <dd className="mt-4">{/* Placeholder for tags. */}</dd>
        </dl>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-grey-quaternary">
          <div className="-mr-px flex w-0 flex-1">
            <button
              type="button"
              className="group relative inline-flex flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-blue-secondary hover:bg-blue-secondary hover:text-yellow-primary"
            >
              <StarIcon
                className="h-5 w-5 fill-white-primary group-hover:fill-yellow-primary"
                aria-hidden="true"
              />
              <div className="sr-only">Favorite</div>
            </button>
          </div>
          <div className="flex w-0 flex-1">
            <button
              type="button"
              className="group relative inline-flex flex-1 items-center justify-center border border-transparent py-4 text-sm font-medium text-blue-secondary hover:bg-blue-secondary hover:text-green-primary"
            >
              <UserPlusIcon
                className="h-5 w-5 fill-white-primary group-hover:fill-green-primary"
                aria-hidden="true"
              />
              <div className="sr-only">Share</div>
            </button>
          </div>
          <div className="-ml-px flex w-0 flex-1">
            <button
              type="button"
              className="group relative inline-flex flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-red-secondary hover:bg-red-primary hover:text-white-primary"
            >
              <TrashIcon
                className="h-5 w-5 fill-white-primary hover:stroke-red-primary group-hover:stroke-red-secondary"
                aria-hidden="true"
              />
              <div className="sr-only">Delete</div>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default SessionPreview;
