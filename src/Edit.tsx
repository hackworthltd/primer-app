import {
  CreateDefModal,
  TreeReactFlow,
  Error,
  ActionPanel,
  PictureInPicture,
  Sidebar,
  Toolbar,
} from "@/components";
import type { Def, TypeDef } from "@/primer-api/model";
import {
  QueryKey,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { DependencyList, useEffect, useRef, useState } from "react";
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
  useUndo,
  useRedo,
} from "./primer-api";
import {
  defaultTreeReactFlowProps,
  ScrollToDef,
} from "@/components/TreeReactFlow";

// hardcoded values (for now)
const initialLevel: Level = "Expert";

const Edit = (): JSX.Element => {
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
      undoAvailable={prog.undoAvailable}
      redoAvailable={prog.redoAvailable}
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
  undoAvailable: boolean;
  redoAvailable: boolean;
}): JSX.Element => {
  const [level, setLevel] = useState<Level>(initialLevel);
  const toggleLevel = (): void => {
    switch (level) {
      case "Beginner":
        setLevel("Intermediate");
        break;
      case "Intermediate":
        setLevel("Expert");
        break;
      case "Expert":
        setLevel("Beginner");
        break;
    }
  };
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
  const undo = useUndo();
  const redo = useRedo();

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

  const scrollToDefRef = useRef<ScrollToDef | undefined>(undefined);
  const scrollToTypeDefRef = useRef<ScrollToDef | undefined>(undefined);
  const defs = p.module.defs
    .sort((a, b) => cmpName(a.name, b.name))
    .map((d) => d.name.baseName);
  return (
    <div className="grid h-screen grid-cols-[18rem_auto_20rem]">
      <div className="h-full overflow-hidden">
        <Sidebar
          initialMode="T&D"
          prog={{
            defs,
            types: p.module.types
              .sort((a, b) => cmpName(a.name, b.name))
              .map((t) => t.name.baseName),
            importedDefs: p.imports
              .flatMap((m) => m.defs)
              .sort((a, b) => cmpName(a.name, b.name))
              .map((d) => d.name.baseName),
            importedTypes: p.imports
              .flatMap((m) => m.types)
              .sort((a, b) => cmpName(a.name, b.name))
              .map((t) => t.name.baseName),
          }}
          onClickDef={(defName, _event) => {
            if (scrollToDefRef.current != undefined) {
              scrollToDefRef.current(defName);
            }
          }}
          onClickAddDef={onClickAddDef}
          onClickTypeDef={(defName, _event) => {
            if (scrollToTypeDefRef.current != undefined) {
              scrollToTypeDefRef.current(defName);
            }
          }}
          onClickAddTypeDef={() => setShowCreateTypeDefModal(true)}
          shadowed={false}
          type="?"
          folder="unknown"
        />
      </div>

      <div className="relative h-full">
        <TreeReactFlow
          scrollToDefRef={scrollToDefRef}
          scrollToTypeDefRef={scrollToTypeDefRef}
          {...defaultTreeReactFlowProps}
          {...(selection && { selection })}
          onNodeClick={(_e, sel) => sel && setSelection(sel)}
          defs={p.module.defs}
          typeDefs={p.module.types}
          level={level}
          fitViewParams={{}}
        >
          <div className="absolute bottom-4 right-4 z-30">
            <Toolbar
              onModeChange={() => {
                console.log("Toggle mode");
              }}
              level={level}
              onLevelChange={toggleLevel}
              undoAvailable={p.undoAvailable}
              onClickUndo={() => {
                undo
                  .mutateAsync({
                    sessionId: p.sessionId,
                  })
                  .then(p.setProg);
              }}
              redoAvailable={p.redoAvailable}
              onClickRedo={() => {
                redo
                  .mutateAsync({
                    sessionId: p.sessionId,
                  })
                  .then(p.setProg);
              }}
              initialMode="tree"
            />
          </div>

          <PictureInPicture
            level={level}
            // Note: these offsets are rather arbitrary.
            initialPosition={{ x: 10, y: 10 }}
            moduleName={p.module.modname}
            evalFull={{
              request: setEvalTarget,
              ...(evalResult.isSuccess ? { result: evalResult.data } : {}),
            }}
            defs={defs}
          />
        </TreeReactFlow>
      </div>

      <div className="h-full overflow-hidden">
        {selection ? (
          <ActionsListSelection
            level={level}
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
            defType="definition"
            moduleDefNames={
              new Set(p.module.defs.map((d: Def) => d.name.baseName))
            }
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
          <CreateDefModal
            defType="type"
            moduleDefNames={
              new Set(p.module.types.map((t: TypeDef) => t.name.baseName))
            }
            open={showCreateTypeDefModal}
            onClose={() => setShowCreateTypeDefModal(false)}
            onCancel={() => setShowCreateTypeDefModal(false)}
            onSubmit={(name: string) => {
              createTypeDef
                .mutateAsync({
                  sessionId: p.sessionId,
                  data: {
                    moduleName: p.module.modname,
                    typeName: name,
                    ctors: [],
                  },
                })
                .then(p.setProg)
                .then(() => setShowCreateTypeDefModal(false));
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

const ActionsListSelection = (p: {
  selection: Selection;
  sessionId: string;
  level: Level;
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

export default Edit;
