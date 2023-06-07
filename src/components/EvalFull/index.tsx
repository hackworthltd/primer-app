import { useState } from "react";
import { NodeChange, ReactFlowProvider, useReactFlow } from "reactflow";
import { EvalFullResp, GlobalName, Level } from "@/primer-api";
import { SelectMenu, TreeReactFlowOne } from "@/components";
import { defaultTreeReactFlowProps } from "../TreeReactFlow";

export type EvalFullProps = {
  moduleName: string[];
  evalFull: {
    request: (baseName: string | undefined) => void;
    result?: EvalFullResp;
  };
  level: Level;
  defs: string[];
};

const Evaluated = (p: {
  defName: GlobalName;
  evaluated?: EvalFullResp;
  level: Level;
}) => {
  const padding = 3.0;
  const { fitView } = useReactFlow();
  const onNodesChange = (_: NodeChange[]) => {
    fitView({ padding });
  };

  return (
    <TreeReactFlowOne
      {...defaultTreeReactFlowProps}
      {...(p?.evaluated ? { tree: p?.evaluated?.contents } : {})}
      level={p.level}
      zoomBarProps={{ padding }}
      onNodesChange={onNodesChange}
    />
  );
};

const disableEval = "<disabled>";

// We only offer to evaluate the definitions in the "main" module
export const EvalFull = ({
  defs,
  evalFull,
  moduleName,
  level,
}: EvalFullProps): JSX.Element => {
  const [evalDef, setEvalDef0] = useState(disableEval);
  const setEvalDef = (e: string) => {
    setEvalDef0(e);
    evalFull.request(e === disableEval ? undefined : e);
  };
  return (
    <div className="flex h-full flex-col overflow-auto">
      <div className="mx-2">
        <SelectMenu
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
                defName={{ qualifiedModule: moduleName, baseName: evalDef }}
                {...(evalFull.result ? { evaluated: evalFull.result } : {})}
                level={level}
              />
            </ReactFlowProvider>
          </div>
        </>
      )}
    </div>
  );
};

export default EvalFull;
