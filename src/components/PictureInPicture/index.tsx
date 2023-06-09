import {
  EllipsisHorizontalIcon,
  InformationCircleIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";
import {
  InformationCircleIcon as InformationCircleIconSolid,
  PlayCircleIcon as PlayCircleIconSolid,
} from "@heroicons/react/24/solid";
import classNames from "classnames";
import { useRef, useState } from "react";
import { useDraggable, DragOptions } from "@neodrag/react";
import { Tab } from "@headlessui/react";
import type { EvalFullProps } from "@/components/EvalFull";
import type { SelectionInfoProps } from "@/components/SelectionInfo";
import { EvalFull, SelectionInfo } from "@/components";

export type PictureInPictureTab = "Eval" | "Info";

export type PictureInPictureProps = {
  initialTab: PictureInPictureTab;
  initialPosition: { x: number; y: number };
} & EvalFullProps &
  SelectionInfoProps;

const tabClasses = (selected: boolean, extra?: string) =>
  classNames(
    "w-full px-1 py-2.5 inline-flex items-center text-sm bg-grey-primary hover:bg-grey-primary-hover",
    selected
      ? "font-bold text-blue-primary border-b-4 border-b-blue-primary"
      : "font-medium text-grey-secondary border-b-2 border-b-grey-quaternary",
    extra
  );

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
        "flex w-full flex-row max-w-sm h-70 rounded bg-grey-primary absolute z-30",
        touchDragging ? "shadow-2xl -my-1 -mx-2" : "shadow-lg"
      )}
    >
      <div className="grow">
        <Tab.Group defaultIndex={1}>
          <Tab.List className="flex flex-row rounded pb-2">
            <Tab
              className={({ selected }) => tabClasses(selected, "rounded-tl")}
            >
              {({ selected }) =>
                selected ? (
                  <div className="flex w-full flex-row items-center justify-center gap-x-2">
                    <PlayCircleIconSolid className="h-8 fill-blue-primary" />
                    <div>Evaluate</div>
                  </div>
                ) : (
                  <div className="flex w-full flex-row items-center justify-center gap-x-2">
                    <PlayCircleIcon className="h-8 text-grey-secondary" />
                    <div>Evaluate</div>
                  </div>
                )
              }
            </Tab>
            <Tab className={({ selected }) => tabClasses(selected)}>
              {({ selected }) =>
                selected ? (
                  <div className="flex w-full flex-row items-center justify-center gap-x-2">
                    <InformationCircleIconSolid className="h-8 fill-blue-primary" />
                    <div>Selection info</div>
                  </div>
                ) : (
                  <div className="flex w-full flex-row items-center justify-center gap-x-2">
                    <InformationCircleIcon className="h-8 text-grey-secondary" />
                    <div>Selection Info</div>
                  </div>
                )
              }
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <div className="h-60">
                <EvalFull {...p} />
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="h-60">
                <SelectionInfo {...p} />
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      <div className="flex w-8 select-none flex-col items-center overflow-hidden rounded-r border-l border-grey-quaternary bg-grey-primary">
        <div className="neodrag-react-handle flex w-6 flex-col">
          <EllipsisHorizontalIcon className="stroke-grey-secondary" />
          <EllipsisHorizontalIcon className="-mt-4 stroke-grey-secondary" />
          <EllipsisHorizontalIcon className="-mt-4 stroke-grey-secondary" />
        </div>
      </div>
    </div>
  );
};

export default PictureInPicture;
