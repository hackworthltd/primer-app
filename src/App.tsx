import {
  CreateDefModal,
  CreateTypeDefModal,
  TreeReactFlow,
  Error,
  ActionPanel,
  Sidebar,
} from "@/components";
import {
  QueryKey,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { DependencyList, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetAvailableActions,
  useGetProgram,
  Selection,
  Module,
  GlobalName,
  Prog,
  useApplyAction,
  useApplyActionWithInput,
  NoInputAction,
  InputAction,
  Option,
  Options,
  useGetActionOptions,
  useCreateDefinition,
  useCreateTypeDef,
  useEvalFull,
  Level,
} from "./primer-api";

// hardcoded values (for now)
const initialLevel: Level = "Expert";

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
  const queryRes = useGetProgram(sessionId);

  if (queryRes.error) {
    return (
      <Error
        string={
          "Failed to get program from backend: " +
          JSON.stringify(queryRes.error)
        }
      />
    );
  }

  // This state will appear on every load, usually only very briefly,
  // and we choose to just show nothing.
  if (queryRes.isLoading) {
    return <></>;
  }

  // At this point, we have successfully received an initial program.
  return <AppProg initialProg={queryRes.data} {...{ sessionId }}></AppProg>;
};

const AppProg = (p: { sessionId: string; initialProg: Prog }): JSX.Element => {
  const [prog, setProg0] = useState<Prog>(p.initialProg);
  const [selection, setSelection] = useState<Selection | undefined>(
    prog.selection
  );
  const setProg = (prog: Prog) => {
    setProg0(prog);
    setSelection(prog.selection);
  };
  const editableModules = prog.modules.filter((m) => m.editable);
  const importedModules = prog.modules.filter((m) => !m.editable);
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

  // At this point, we have successfully loaded a program, and performed some sanity checks upon it.
  // `AppNoError` needs to be its own component because of the rules around conditional hooks in React.
  return (
    <AppNoError
      sessionId={p.sessionId}
      module={module}
      imports={importedModules}
      selection={selection}
      setSelection={setSelection}
      setProg={setProg}
    />
  );
};

function cmpName(a: GlobalName, b: GlobalName) {
  const aq = a.qualifiedModule;
  const bq = b.qualifiedModule;
  const la = aq.length;
  const lb = bq.length;
  const l = Math.min(la, lb);
  for (let i = 0; i < l; i++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (aq[i]! < bq[i]!) return -1;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (aq[i]! > bq[i]!) return 1;
  }
  if (la < lb) return -1;
  if (la > lb) return 1;
  const an = a.baseName;
  const bn = b.baseName;
  if (an < bn) return -1;
  if (an > bn) return 1;
  return 0;
}

const useInvalidateOnChange = <TData, TError>(
  res: UseQueryResult<TData, TError> & { queryKey: QueryKey },
  deps: DependencyList
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryClient = useQueryClient();
  useEffect(
    () => {
      (async () =>
        await queryClient.invalidateQueries(res.queryKey, { exact: true }))();
    },
    // We stringify the queryKey as a poor-man's deep equality check,
    // since the orval generated bindings to react-query construct a
    // new key (a list) each time it is used. Whilst the contents of
    // this key do not change, the object does.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queryClient, JSON.stringify(res.queryKey), ...deps]
  );
  return res;
};

const AppNoError = ({
  selection,
  setSelection,
  ...p
}: {
  sessionId: string;
  module: Module;
  imports: Module[];
  selection: Selection | undefined;
  setSelection: (s: Selection) => void;
  setProg: (p: Prog) => void;
}): JSX.Element => {
  const [level, setLevel] = useState<Level>(initialLevel);
  const [showCreateDefModal, setShowCreateDefModal] = useState<boolean>(false);
  const [showCreateTypeDefModal, setShowCreateTypeDefModal] =
    useState<boolean>(false);
  const onClickAddDef = (): void => {
    setShowCreateDefModal(true);
  };

  const createDef = useCreateDefinition();
  const createTypeDef = useCreateTypeDef();
  const applyAction = useApplyAction();
  const applyActionWithInput = useApplyActionWithInput();
  const getOptions = useGetActionOptions();

  const [evalTarget, setEvalTarget] = useState<string | undefined>();
  const evalResult = useInvalidateOnChange(
    useEvalFull(
      p.sessionId,
      { qualifiedModule: p.module.modname, baseName: evalTarget || "" },
      { stepLimit: 100 },
      { query: { enabled: !!evalTarget } }
    ),
    [p.module]
  );
  return (
    <div className="grid h-screen grid-cols-[18rem_auto_20rem]">
      <div className="overflow-scroll">
        <Sidebar
          initialMode="T&D"
          prog={{
            defs: p.module.defs
              .sort((a, b) => cmpName(a.name, b.name))
              .map((d) => d.name.baseName),
            types: p.module.types
              .sort((a, b) => cmpName(a, b))
              .map((t) => t.baseName),
            importedDefs: p.imports
              .flatMap((m) => m.defs)
              .sort((a, b) => cmpName(a.name, b.name))
              .map((d) => d.name.baseName),
            importedTypes: p.imports
              .flatMap((m) => m.types)
              .sort((a, b) => cmpName(a, b))
              .map((t) => t.baseName),
          }}
          onClickDef={(_label, _event) => ({})}
          onClickAddDef={onClickAddDef}
          onClickTypeDef={(_label, _event) => ({})}
          onClickAddTypeDef={() => setShowCreateTypeDefModal(true)}
          shadowed={false}
          type="?"
          folder="unknown"
          moduleName={p.module.modname}
          evalFull={{
            request: setEvalTarget,
            ...(evalResult.isSuccess ? { result: evalResult.data } : {}),
          }}
          level={level}
        />
      </div>
      <TreeReactFlow
        {...(selection && { selection })}
        onNodeClick={(_e, node) => {
          if (!("nodeType" in node.data)) {
            setSelection({
              def: node.data.def,
            });
          } else {
            const id = Number(node.id);
            // Non-numeric IDs correspond to non-selectable nodes (those with no ID in backend) e.g. pattern constructors.
            if (!isNaN(id)) {
              setSelection({
                def: node.data.def,
                node: { id, nodeType: node.data.nodeType },
              });
            }
          }
        }}
        defs={p.module.defs}
        forestLayout="Horizontal"
        treePadding={100}
        nodeWidth={80}
        nodeHeight={35}
        boxPadding={50}
        level={level}
      />
      {selection ? (
        <ActionsListSelection
          level={level}
          onChangeLevel={setLevel}
          selection={selection}
          sessionId={p.sessionId}
          onAction={(action) => {
            applyAction
              .mutateAsync({
                sessionId: p.sessionId,
                params: { action },
                data: selection,
              })
              .then(p.setProg);
          }}
          onInputAction={(action, option) => {
            applyActionWithInput
              .mutateAsync({
                sessionId: p.sessionId,
                params: { action },
                data: { option, selection },
              })
              .then(p.setProg);
          }}
          onRequestOpts={(action) => {
            return getOptions.mutateAsync({
              data: selection,
              sessionId: p.sessionId,
              params: { action: action, level },
            });
          }}
        />
      ) : (
        <div className="p-10">
          Click something on the canvas to see available actions!
        </div>
      )}
      {showCreateDefModal ? (
        <CreateDefModal
          open={showCreateDefModal}
          onClose={() => setShowCreateDefModal(false)}
          onCancel={() => setShowCreateDefModal(false)}
          onSubmit={(name: string) => {
            createDef
              .mutateAsync({
                sessionId: p.sessionId,
                params: { name },
                data: p.module.modname,
              })
              .then(p.setProg);
            setShowCreateDefModal(false);
          }}
        />
      ) : null}
      {showCreateTypeDefModal ? (
        <CreateTypeDefModal
          moduleTypeDefNames={new Set(p.module.types.map((t) => t.baseName))}
          open={showCreateTypeDefModal}
          onClose={() => setShowCreateTypeDefModal(false)}
          onCancel={() => setShowCreateTypeDefModal(false)}
          onSubmit={(typeName: string, ctorNames: string[]) => {
            createTypeDef
              .mutateAsync({
                sessionId: p.sessionId,
                data: {
                  moduleName: p.module.modname,
                  typeName,
                  ctors: ctorNames,
                },
              })
              .then(p.setProg)
              .then(() => setShowCreateTypeDefModal(false));
          }}
        />
      ) : null}
    </div>
  );
};

const ActionsListSelection = (p: {
  selection: Selection;
  sessionId: string;
  level: Level;
  onChangeLevel: (level: Level) => void;
  onAction: (action: NoInputAction) => void;
  onInputAction: (action: InputAction, option: Option) => void;
  onRequestOpts: (acrion: InputAction) => Promise<Options>;
}) => {
  const queryRes = useGetAvailableActions(p.sessionId, p.selection, {
    level: p.level,
  });
  const actions = queryRes.isSuccess ? queryRes.data : [];
  return <ActionPanel {...{ actions, ...p }} />;
};

export default App;
