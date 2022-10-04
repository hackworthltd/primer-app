import {
  TreeReactFlow,
  Error,
  ActionButtonList,
  Sidebar,
} from "@hackworthltd/primer-components";
import "@hackworthltd/primer-components/style.css";
import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetAvailableActions,
  useGetProgram,
  Selection,
  Module,
} from "@hackworthltd/primer-types";

const App = (): JSX.Element => {
  const params = useParams();
  const sessionId = params["sessionId"];

  if (!sessionId) {
    return (
      <Error string={"No sessionId parameter: " + JSON.stringify(params)} />
    );
  }
  // This hook is *technically* conditional.
  // But if the condition above fails, then the app is broken anyway.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const queryRes = useGetProgram(sessionId, { patternsUnder: true });

  if (!queryRes.isSuccess) {
    return (
      <Error
        string={
          "Failed to get program from backend: " +
          JSON.stringify(queryRes.error)
        }
      />
    );
  }
  const prog = queryRes.data;

  const editableModules = prog.modules.filter((m) => m.editable);
  if (editableModules.length > 1) {
    return (
      <Error
        string={"Multiple editable modules: " + JSON.stringify(editableModules)}
      />
    );
  }
  const module = editableModules[0];
  if (!module) {
    return <Error string="No editable modules" />;
  }

  // At this point, we have successfully loaded a program.
  // `AppNoError` needs to be its own component because of the rules around conditional hooks in React.
  return <AppNoError sessionId={sessionId} module={module} />;
};

const AppNoError = (p: { sessionId: string; module: Module }): JSX.Element => {
  const [selection, setSelection] = useState<Selection | undefined>(undefined);
  const selectedNodeId = selection?.node?.id;
  return (
    <div className="grid h-screen grid-cols-[18rem_auto_20rem]">
      <div className="overflow-scroll">
        <Sidebar
          initialMode="T&D"
          prog={{
            defs: p.module.defs.map((d) => d.name.baseName),
            types: p.module.types.map((t) => t.baseName),
            importedDefs: [],
            importedTypes: [],
          }}
          onClickDef={(_label, _event) => ({})}
          onClickAdd={(_label, _event) => ({})}
          shadowed={false}
          type="?"
          folder="unknown"
        />
      </div>
      <TreeReactFlow
        {...(selectedNodeId && { selection: selectedNodeId.toString() })}
        onNodeClick={(_e, node) => {
          const id = Number(node.id);
          // Non-numeric IDs correspond to non-selectable nodes (those with no ID in backend) e.g. pattern constructors.
          if (!isNaN(id)) {
            setSelection({
              def: node.data.def,
              node: { id, nodeType: node.data.nodeType },
            });
          }
        }}
        defs={p.module.defs}
        nodeWidth={150}
        nodeHeight={50}
        boxPadding={50}
      />
      {selection ? (
        <ActionsListSelection selection={selection} sessionId={p.sessionId} />
      ) : (
        <ActionButtonList actions={[]} />
      )}
    </div>
  );
};

const ActionsListSelection = (p: {
  selection: Selection;
  sessionId: string;
}) => {
  const queryRes = useGetAvailableActions(p.sessionId, p.selection, {
    level: "Expert",
  });
  const actions = queryRes.isSuccess ? queryRes.data : [];
  return <ActionButtonList actions={actions} />;
};

export default App;
