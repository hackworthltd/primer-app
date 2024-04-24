import { useState } from "react";
import { NodeChange, ReactFlowProvider, useReactFlow } from "@xyflow/react";
import { EvalBoundedInterpResp, GlobalName, Level } from "@/primer-api";
import { SelectMenu, TreeReactFlowOne } from "@/components";
import {
  TreeReactFlowOneProps,
  defaultTreeReactFlowProps,
} from "../TreeReactFlow";

export type EvalBoundedInterpProps = {
  moduleName: string[];
  evalBoundedInterp: {
    request: (baseName: string | undefined) => void;
    result?: EvalBoundedInterpResp;
  };
  level: Level;
  defs: string[];
  initialEvalDef: string | undefined;
  extraTreeProps: Partial<TreeReactFlowOneProps>;
};

const Evaluated = (p: {
  defName: GlobalName;
  evaluated?: EvalBoundedInterpResp;
  level: Level;
  extraTreeProps: Partial<TreeReactFlowOneProps>;
}) => {
  const padding = 1.0;
  const { fitView } = useReactFlow();
  const onNodesChange = (_: NodeChange[]) => {
    fitView({ padding });
  };
  const resultTree = () => {
    switch (p?.evaluated?.tag) {
      case "EvalBoundedInterpRespNormal":
        return { tree: p.evaluated.contents };
      default:
        // This should be some indication of an error having occurred,
        // but our UI is a bit too limited for that at the moment.
        return {};
    }
  };

  return (
    <TreeReactFlowOne
      {...defaultTreeReactFlowProps}
      {...resultTree()}
      level={p.level}
      zoomBarProps={{ padding }}
      onNodesChange={onNodesChange}
      fitViewOptions={{ padding }}
      {...p.extraTreeProps}
    />
  );
};

const disableEval = "<disabled>";

// We only offer to evaluate the definitions in the "main" module
export const EvalBoundedInterp = ({
  defs,
  evalBoundedInterp,
  moduleName,
  level,
  initialEvalDef,
  extraTreeProps,
}: EvalBoundedInterpProps): JSX.Element => {
  const [evalDef, setEvalDef0] = useState(initialEvalDef ?? disableEval);
  const setEvalDef = (e: string) => {
    setEvalDef0(e);
    evalBoundedInterp.request(e === disableEval ? undefined : e);
  };
  return (
    <div className="flex h-full flex-col overflow-auto">
      <div className="mx-2">
        <SelectMenu
          label="Definition"
          selected={evalDef}
          options={[disableEval].concat(defs)}
          optionType="code"
          onChange={(selection: string) => setEvalDef(selection)}
        />
      </div>
      {evalDef !== disableEval && (
        <>
          <div className="grow">
            <ReactFlowProvider>
              <Evaluated
                key={evalDef}
                defName={{ qualifiedModule: moduleName, baseName: evalDef }}
                {...(evalBoundedInterp.result
                  ? { evaluated: evalBoundedInterp.result }
                  : {})}
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

export default EvalBoundedInterp;
