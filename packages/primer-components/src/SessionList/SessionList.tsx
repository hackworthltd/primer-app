import "@/index.css";

import { SessionMeta, SessionPreview } from "@/SessionPreview/SessionPreview";

interface SessionListProps {
  sessions: SessionMeta[];
}

export const SessionList = ({ sessions }: SessionListProps): JSX.Element => (
  <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 xl:gap-x-8 gap-y-8">
    {sessions.map((session) => (
      <li key={session.id} className="relative">
        <SessionPreview session={session} />
      </li>
    ))}
  </ul>
);
