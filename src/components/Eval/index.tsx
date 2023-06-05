import { useState } from "react";
import { EvalFullResp, GlobalName, Level } from "@/primer-api";
import { TreeReactFlowOne } from "@/components";
import { defaultTreeReactFlowProps } from "../TreeReactFlow";

export type EvalProps = {
  moduleName: string[];
  evalFull: {
    request: (baseName: string | undefined) => void;
    result?: EvalFullResp;
  };
  level: Level;
};

const Evaluated = (p: {
  defName: GlobalName;
  evaluated?: EvalFullResp;
  level: Level;
}) => {
  return (
    <TreeReactFlowOne
      {...defaultTreeReactFlowProps}
      {...(p?.evaluated ? { tree: p?.evaluated?.contents } : {})}
      level={p.level}
    />
  );
};

const headerStyle = "pb-3 text-base lg:text-lg font-bold text-blue-primary";
const subHeaderStyle = "mb-1 text-sm lg:text-base font-bold text-blue-primary";

// We only offer to evaluate the definitions in the "main" module
export const Eval = ({
  defs,
  evalFull,
  moduleName,
  level,
}: EvalProps & { defs: string[] }): JSX.Element => {
  const [evalDef, setEvalDef0] = useState("");
  const setEvalDef = (e: string) => {
    setEvalDef0(e);
    evalFull.request(e === "" ? undefined : e);
  };
  return (
    <div className="flex h-full flex-col overflow-auto">
      <div className={headerStyle}>Evaluation</div>
      <div className="flex grow flex-col gap-5 overflow-hidden p-2 leading-8">
        <div>
          <div className={subHeaderStyle}>Evaluating</div>
          <select value={evalDef} onChange={(e) => setEvalDef(e.target.value)}>
            <option key="" value="">
              ---None---
            </option>
            {
              /* NB: all def names are distinct and non-empty*/
              defs.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))
            }
          </select>
        </div>
        {evalDef !== "" && (
          <>
            <div className="grow">
              <div className={subHeaderStyle}>gives</div>
              <Evaluated
                defName={{ qualifiedModule: moduleName, baseName: evalDef }}
                {...(evalFull.result ? { evaluated: evalFull.result } : {})}
                level={level}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Eval;
