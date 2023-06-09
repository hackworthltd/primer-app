import { NodeChange, ReactFlowProvider, useReactFlow } from "reactflow";
import { Level, TypeOrKind } from "@/primer-api";
import { TreeReactFlowOne } from "@/components";
import { defaultTreeReactFlowProps } from "../TreeReactFlow";

export type SelectionInfoProps = {
  typeOrKind: TypeOrKind | undefined;
  level: Level;
};

const TypeOrKindTree = (p: { typeOrKind: TypeOrKind; level: Level }) => {
  const padding = 1.0;
  const { fitView } = useReactFlow();
  const onNodesChange = (_: NodeChange[]) => {
    fitView({ padding });
  };

  return (
    <TreeReactFlowOne
      {...defaultTreeReactFlowProps}
      tree={p.typeOrKind.contents}
      level={p.level}
      zoomBarProps={{ padding }}
      onNodesChange={onNodesChange}
      fitViewOptions={{ padding }}
    />
  );
};

export const SelectionInfo = ({
  typeOrKind,
  level,
}: SelectionInfoProps): JSX.Element => {
  return (
    <div className="flex h-full flex-col overflow-auto">
      {typeOrKind && (
        <>
          <div className="mx-2 block text-sm font-medium leading-6 text-blue-primary">
            Type
          </div>
          <div className="grow">
            <ReactFlowProvider>
              <TypeOrKindTree typeOrKind={typeOrKind} level={level} />
            </ReactFlowProvider>
          </div>
        </>
      )}
    </div>
  );
};

export default SelectionInfo;
