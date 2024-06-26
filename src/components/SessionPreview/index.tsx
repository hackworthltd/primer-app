import "@/index.css";

import { StarIcon, TrashIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

import { BinaryTreePlaceholder } from "@/components";
import type { Session } from "@/primer-api";

export interface SessionPreviewProps {
  session: Session;
  onClickDelete: () => void;
}

export const SessionPreview = ({
  session,
  onClickDelete,
}: SessionPreviewProps): JSX.Element => {
  const locale: string = navigator.language;
  return (
    <div className="flex flex-col divide-y divide-grey-quaternary rounded-lg bg-white-primary text-center drop-shadow-md">
      <div className="flex flex-1 flex-col">
        <Link
          to={`/sessions/${session.id}`}
          key={session.id}
          className="group rounded-t-lg hover:text-blue-primary"
        >
          <BinaryTreePlaceholder className="mx-auto size-16 shrink-0 fill-current text-white-primary group-hover:text-blue-primary md:size-48" />
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
              className="group inline-flex flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-blue-secondary hover:bg-blue-secondary hover:text-yellow-primary"
            >
              <StarIcon
                className="size-5 fill-white-primary group-hover:fill-yellow-primary"
                aria-hidden="true"
              />
              <div className="sr-only">Favorite</div>
            </button>
          </div>
          <div className="flex w-0 flex-1">
            <button
              type="button"
              className="group inline-flex flex-1 items-center justify-center border border-transparent py-4 text-sm font-medium text-blue-secondary hover:bg-blue-secondary hover:text-green-primary"
            >
              <UserPlusIcon
                className="size-5 fill-white-primary group-hover:fill-green-primary"
                aria-hidden="true"
              />
              <div className="sr-only">Share</div>
            </button>
          </div>
          <div className="-ml-px flex w-0 flex-1">
            <button
              type="button"
              className="group inline-flex flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-red-secondary hover:bg-red-primary hover:text-white-primary"
              onClick={onClickDelete}
            >
              <TrashIcon
                className="size-5 fill-white-primary hover:stroke-red-primary group-hover:stroke-red-secondary"
                aria-hidden="true"
              />
              <div className="sr-only">Delete</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionPreview;
