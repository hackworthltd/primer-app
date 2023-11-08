import { NodeChange, ReactFlowProvider, useReactFlow } from "reactflow";
import { Level, TypeOrKind } from "@/primer-api";
import { TreeReactFlowOne } from "@/components";
import {
  TreeReactFlowOneProps,
  defaultTreeReactFlowProps,
} from "../TreeReactFlow";

export type SelectionInfoProps = {
  typeOrKind: TypeOrKind | undefined;
  level: Level;
  extraTreeProps: Partial<TreeReactFlowOneProps>;
};

const TypeOrKindTree = (p: {
  typeOrKind: TypeOrKind;
  level: Level;
  extraTreeProps: Partial<TreeReactFlowOneProps>;
}) => {
  const padding = 1.0;
  const { fitView } = useReactFlow();
  const onNodesChange = (_: NodeChange[]) => {
    fitView({ padding });
  };

  const tk = p.typeOrKind.contents;
  return (
    <TreeReactFlowOne
      {...defaultTreeReactFlowProps}
      tree={tk.tag === "Ok" ? tk.contents : tk.expected}
      level={p.level}
      zoomBarProps={{ padding }}
      onNodesChange={onNodesChange}
      fitViewOptions={{ padding }}
      {...p.extraTreeProps}
    />
  );
};

export const SelectionInfo = ({
  typeOrKind,
  level,
  extraTreeProps,
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
              <TypeOrKindTree
                typeOrKind={typeOrKind}
                level={level}
                extraTreeProps={extraTreeProps}
              />
            </ReactFlowProvider>
          </div>
        </>
      )}
    </div>
  );
};

export default SelectionInfo;
