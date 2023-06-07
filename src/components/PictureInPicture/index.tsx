import classNames from "classnames";
import { useRef, useState } from "react";
import { useDraggable, DragOptions } from "@neodrag/react";
import type { EvalFullProps } from "@/components/EvalFull";
import { EvalFull } from "@/components";

export type PictureInPictureProps = {
  initialPosition: { x: number; y: number };
} & EvalFullProps;

export const PictureInPicture = (p: PictureInPictureProps): JSX.Element => {
  const [touchDragging, setTouchDragging] = useState(false);

  const draggableRef = useRef(null);
  const options: DragOptions = {
    defaultPosition: p.initialPosition,
    handle: ".neodrag-react-handle",
    bounds: "parent",
    onDragStart: (_) => {
      setTouchDragging(true);
    },
    onDragEnd: (_) => {
      setTouchDragging(false);
    },
  };
  useDraggable(draggableRef, options);

  return (
    <div
      ref={draggableRef}
      className={classNames(
        "rounded bg-grey-primary absolute h-80 w-80 z-30 flex flex-col",
        touchDragging ? "shadow-2xl -my-1 -mx-2" : "shadow-lg"
      )}
    >
      <div className="neodrag-react-handle mx-2 mt-2 block select-none text-sm font-medium leading-6 text-blue-primary">
        Evaluate
      </div>
      <div className="grow">
        <EvalFull {...p} />
      </div>
    </div>
  );
};

export default PictureInPicture;
