import "@/index.css";

import { SessionMeta } from "@/Types";
import { SessionPreview } from "@/components";

export interface SessionListProps {
  /**
   * The list of session metadata.
   */
  sessions: SessionMeta[];
}

export const SessionList = ({ sessions }: SessionListProps): JSX.Element => (
  <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
    {sessions.map((session) => (
      <li key={session.id} className="relative">
        <SessionPreview session={session} />
      </li>
    ))}
  </ul>
);
