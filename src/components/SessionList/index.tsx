import "@/index.css";

import { SessionPreview } from "@/components";
import { Session } from "@/primer-client";

export interface SessionListProps {
  /**
   * The list of session metadata.
   */
  sessions: Session[];
  onClickDelete: (id: string) => void;
}

export const SessionList = ({
  sessions,
  onClickDelete,
}: SessionListProps): JSX.Element => (
  <ul
    role="list"
    className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
  >
    {sessions.map((session) => (
      <li key={session.id} className="col-span-1">
        <SessionPreview
          session={session}
          onClickDelete={() => onClickDelete(session.id)}
        />
      </li>
    ))}
  </ul>
);

export default SessionList;
