import { NodeChange, ReactFlowProvider, useReactFlow } from "@xyflow/react";
import { Tree, Level, TypeOrKind } from "@/primer-api";
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
  typeOrKind: Tree;
  level: Level;
  extraTreeProps: Partial<TreeReactFlowOneProps>;
}) => {
  const padding = 1.0;
  const { fitView } = useReactFlow();
  const onNodesChange = (_: NodeChange[]) => {
    fitView({ padding });
  };

  return (
    <TreeReactFlowOne
      {...defaultTreeReactFlowProps}
      tree={p.typeOrKind}
      level={p.level}
      zoomBarProps={{ padding }}
      onNodesChange={onNodesChange}
      fitViewOptions={{ padding }}
      {...p.extraTreeProps}
    />
  );
};

const SelectionInfoHelper = ({
  title,
  tree,
  level,
  extraTreeProps,
}: {
  title: string;
  tree: Tree;
  level: Level;
  extraTreeProps: Partial<TreeReactFlowOneProps>;
}) => {
  return (
    <div className="flex h-full flex-col overflow-auto">
      <div className="mx-2 block text-sm font-medium leading-6 text-blue-primary">
        {title}
      </div>
      <div className="grow">
        <ReactFlowProvider>
          <TypeOrKindTree
            typeOrKind={tree}
            level={level}
            extraTreeProps={extraTreeProps}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export const SelectionInfo = ({
  typeOrKind,
  level,
  extraTreeProps,
}: SelectionInfoProps): JSX.Element => {
  return (
    <div className="flex h-full flex-col overflow-auto">
      {typeOrKind &&
        (typeOrKind.contents.tag === "Ok" ? (
          <SelectionInfoHelper
            title="Type"
            tree={typeOrKind.contents.contents}
            level={level}
            extraTreeProps={extraTreeProps}
          />
        ) : (
          <>
            <SelectionInfoHelper
              title="Expected Type"
              tree={typeOrKind.contents.expected}
              level={level}
              extraTreeProps={extraTreeProps}
            />
            <SelectionInfoHelper
              title="Actual Type"
              tree={typeOrKind.contents.got}
              level={level}
              extraTreeProps={extraTreeProps}
            />
          </>
        ))}
    </div>
  );
};

export default SelectionInfo;
