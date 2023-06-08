import {
  InformationCircleIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";
import { PropsWithChildren, useRef, useState } from "react";
import { useDraggable, DragOptions } from "@neodrag/react";
import type { EvalFullProps } from "@/components/EvalFull";
import type { SelectionInfoProps } from "@/components/SelectionInfo";
import { EvalFull, SelectionInfo } from "@/components";

export type PictureInPictureTab = "Eval" | "Info";

type TabHandleProps = {
  title: string;
  tab: PictureInPictureTab;
  currentTab: PictureInPictureTab;
  onClick: (tab: PictureInPictureTab) => void;
};

const TabHandle = (p: PropsWithChildren<TabHandleProps>): JSX.Element => {
  return (
    <button
      title={p.title}
      key={p.tab}
      className={classNames(
        "flex",
        p.tab == p.currentTab ? "text-blue-primary" : "text-grey-secondary"
      )}
      onClick={(_) => p.onClick(p.tab)}
    >
      {p.children}
    </button>
  );
};

export type PictureInPictureProps = {
  initialTab: PictureInPictureTab;
  initialPosition: { x: number; y: number };
} & EvalFullProps &
  SelectionInfoProps;

export const PictureInPicture = (p: PictureInPictureProps): JSX.Element => {
  const [currentTab, switchTab] = useState(p.initialTab);
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
        <div className="grid h-12 grid-cols-2 divide-x divide-solid divide-blue-primary text-grey-secondary">
          <TabHandle
            title="Evaluate"
            tab="Eval"
            currentTab={currentTab}
            onClick={switchTab}
          >
            <div className="flex w-full flex-col self-center">
              <PlayCircleIcon className="h-8" />
            </div>
          </TabHandle>
          <TabHandle
            title="Selection info"
            tab="Info"
            currentTab={currentTab}
            onClick={switchTab}
          >
            <div className="flex w-full flex-col self-center">
              <InformationCircleIcon className="h-8" />
            </div>
          </TabHandle>
        </div>
      </div>
      <div className="grow">
        {(() => {
          switch (currentTab) {
            case "Eval":
              return <EvalFull {...p} />;
            case "Info":
              return <SelectionInfo {...p} />;
          }
        })()}
      </div>
    </div>
  );
};

export default PictureInPicture;
