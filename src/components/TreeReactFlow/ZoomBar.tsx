import { useReactFlow, Panel } from "@reactflow/core";
import {
  ArrowsPointingOutIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
} from "@heroicons/react/24/outline";

const buttonClasses =
  "w-8 rounded text-blue-primary hover:bg-blue-primary hover:text-white-primary focus:ring-blue-primary";

export type ZoomBarProps = {
  padding?: number;
};

export const ZoomBar = (p: ZoomBarProps): JSX.Element => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const onZoomIn = () => {
    zoomIn();
  };
  const onZoomOut = () => {
    zoomOut();
  };
  const onFitView = () => {
    fitView({ ...p });
  };

  return (
    <Panel
      position="bottom-left"
      className="absolute flex select-none flex-row items-center justify-center gap-2 rounded bg-grey-primary p-2 text-blue-primary shadow-sm"
    >
      <button onClick={onZoomOut}>
        <MagnifyingGlassMinusIcon className={buttonClasses} />
      </button>
      <button onClick={onFitView}>
        <ArrowsPointingOutIcon className={buttonClasses} />
      </button>
      <button onClick={onZoomIn}>
        <MagnifyingGlassPlusIcon className={buttonClasses} />
      </button>
    </Panel>
  );
};

export default ZoomBar;
