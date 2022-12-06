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
  <ul
    role="list"
    className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
  >
    {sessions.map((session) => (
      <li key={session.id} className="relative col-span-1">
        <SessionPreview session={session} />
      </li>
    ))}
  </ul>
);

export default SessionList;
