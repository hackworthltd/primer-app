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
      // Note: we would prefer to put a <li> here and use it to wrap the
      // `SessionPreview`, implementing `SessionPreview` as a generic <div>.
      // However, this breaks the CSS layout when any of the `SessionPreview`s'
      // dates don't fit on a single line, as then the cards' heights vary
      // depending on whether the displayed date wraps.
      //
      // However, if we implement the `SessionPreview` as a <li> rather than as
      // a <div> inside a <li>, then the CSS works as expected: each card in a
      // given row is the same height, irrespective of whether the displayed
      // date wraps. (@dhess: I don't understand CSS well enough to know why
      // this happens.)
      //
      // There are two implications of this design choice:
      //
      // 1. `SessionPreview` is less generic than we'd like (<li> rather than
      // <div>).
      //
      // 2. We have to pass a `key` property here to `SessionPreview`, or else
      // eslint complains, even though `SessionPreview` knows how to set the key
      // itself. We could tell eslint to ignore the warning in this situation,
      // but I'm not sure whether React also needs the key to be specified
      // explicitly, so better safe than sorry.
      <SessionPreview key={session.id} session={session} />
    ))}
  </ul>
);

export default SessionList;
