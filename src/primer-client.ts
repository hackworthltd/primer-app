import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { ZodiosHooks } from "@zodios/react";
import { z } from "zod";

export type NodeBody =
  | {
      contents: RecordPair_NodeFlavorTextBody_Name;
      tag: "TextBody";
    }
  | {
      contents: RecordPair_NodeFlavorPrimBody_PrimCon;
      tag: "PrimBody";
    }
  | {
      contents: RecordPair_NodeFlavorBoxBody_Tree;
      tag: "BoxBody";
    }
  | {
      contents: NodeFlavorNoBody;
      tag: "NoBody";
    };
export type RecordPair_NodeFlavorTextBody_Name = {
  fst: NodeFlavorTextBody;
  snd: Name;
};
export type NodeFlavorTextBody =
  | "Con"
  | "Lam"
  | "LAM"
  | "Let"
  | "LetType"
  | "Letrec"
  | "PatternBind"
  | "PatternCon"
  | "TCon"
  | "TVar"
  | "TForall"
  | "TLet"
  | "GlobalVar"
  | "LocalVar";
export type Name = {
  baseName: string;
  qualifiedModule?: Array<string> | undefined;
};
export type RecordPair_NodeFlavorPrimBody_PrimCon = {
  fst: NodeFlavorPrimBody;
  snd: PrimCon;
};
export type NodeFlavorPrimBody = "PrimCon" | "PrimPattern";
export type PrimCon =
  | {
      contents: string;
      tag: "PrimChar";
    }
  | {
      contents: number;
      tag: "PrimInt";
    };
export type NodeFlavorBoxBody = "Pattern";
export type NodeFlavorNoBody =
  | "Hole"
  | "EmptyHole"
  | "Ann"
  | "App"
  | "APP"
  | "Case"
  | "CaseWith"
  | "TEmptyHole"
  | "THole"
  | "TFun"
  | "TApp"
  | "PatternWildcard"
  | "KType"
  | "KHole"
  | "KFun";
export type RecordPair_NodeFlavorBoxBody_Tree = {
  fst: NodeFlavorBoxBody;
  snd: Tree;
};
export type Tree = {
  body: NodeBody;
  childTrees: Array<Tree>;
  nodeId: string;
  rightChild?: Tree | undefined;
};

export const UUID = z.string();
export type UUID = z.infer<typeof UUID>;
export const LastModified = z.string();
export type LastModified = z.infer<typeof LastModified>;
export const SessionName = z.string();
export type SessionName = z.infer<typeof SessionName>;
export const Session = z.object({
  id: UUID.uuid(),
  lastModified: LastModified.datetime(),
  name: SessionName,
});
export type Session = z.infer<typeof Session>;
export const PaginatedMeta = z.object({
  firstPage: z.number().int().gt(0).lte(9223372036854776000),
  lastPage: z.number().int().gt(0).lte(9223372036854776000),
  nextPage: z.number().int().gt(0).lte(9223372036854776000).nullish(),
  pageSize: z.number().int().gt(0).lte(9223372036854776000),
  prevPage: z.number().int().gt(0).lte(9223372036854776000).nullish(),
  thisPage: z.number().int().gt(0).lte(9223372036854776000),
  totalItems: z.number().int().gte(0).lte(9223372036854776000),
});
export type PaginatedMeta = z.infer<typeof PaginatedMeta>;
export const Paginated_Session = z.object({
  items: z.array(Session),
  meta: PaginatedMeta,
});
export type Paginated_Session = z.infer<typeof Paginated_Session>;
export const NewSessionReq = z.object({
  importPrelude: z.boolean(),
  name: z.string(),
});
export type NewSessionReq = z.infer<typeof NewSessionReq>;
export const Option = z.object({
  context: z.array(z.string()).min(1).optional(),
  matchesType: z.boolean(),
  option: z.string(),
});
export type Option = z.infer<typeof Option>;
export const GlobalName = z.object({
  baseName: z.string(),
  qualifiedModule: z.array(z.string()).min(1),
});
export type GlobalName = z.infer<typeof GlobalName>;
export const NodeType = z.enum(["BodyNode", "SigNode"]);
export type NodeType = z.infer<typeof NodeType>;
export const NodeSelection = z.object({
  meta: z.number().int().gte(-9223372036854776000).lte(9223372036854776000),
  nodeType: NodeType,
});
export type NodeSelection = z.infer<typeof NodeSelection>;
export const DefSelection = z.object({
  def: GlobalName,
  node: NodeSelection.optional(),
});
export type DefSelection = z.infer<typeof DefSelection>;
export const TypeDefConsFieldSelection = z.object({
  index: z.number().int().gte(-9223372036854776000).lte(9223372036854776000),
  meta: z.number().int().gte(-9223372036854776000).lte(9223372036854776000),
});
export type TypeDefConsFieldSelection = z.infer<
  typeof TypeDefConsFieldSelection
>;
export const TypeDefConsSelection = z.object({
  con: GlobalName,
  field: TypeDefConsFieldSelection.optional(),
});
export type TypeDefConsSelection = z.infer<typeof TypeDefConsSelection>;
export const TypeDefNodeSelection = z.union([
  z.object({
    contents: z.string(),
    tag: z.literal("TypeDefParamNodeSelection"),
  }),
  z.object({
    contents: TypeDefConsSelection,
    tag: z.literal("TypeDefConsNodeSelection"),
  }),
]);
export type TypeDefNodeSelection = z.infer<typeof TypeDefNodeSelection>;
export const TypeDefSelection = z.object({
  def: GlobalName,
  node: TypeDefNodeSelection.optional(),
});
export type TypeDefSelection = z.infer<typeof TypeDefSelection>;
export const Selection = z.union([
  z.object({ contents: DefSelection, tag: z.literal("SelectionDef") }),
  z.object({ contents: TypeDefSelection, tag: z.literal("SelectionTypeDef") }),
]);
export type Selection = z.infer<typeof Selection>;
export const ApplyActionBody = z.object({
  option: Option,
  selection: Selection,
});
export type ApplyActionBody = z.infer<typeof ApplyActionBody>;
export const NodeFlavorTextBody = z.enum([
  "Con",
  "Lam",
  "LAM",
  "Let",
  "LetType",
  "Letrec",
  "PatternBind",
  "PatternCon",
  "TCon",
  "TVar",
  "TForall",
  "TLet",
  "GlobalVar",
  "LocalVar",
]);

export const Name = z.object({
  baseName: z.string(),
  qualifiedModule: z.array(z.string()).min(1).optional(),
});

export const RecordPair_NodeFlavorTextBody_Name = z.object({
  fst: NodeFlavorTextBody,
  snd: Name,
});

export const NodeFlavorPrimBody = z.enum(["PrimCon", "PrimPattern"]);

export const PrimCon = z.union([
  z.object({ contents: z.string().min(1).max(1), tag: z.literal("PrimChar") }),
  z.object({ contents: z.number().int(), tag: z.literal("PrimInt") }),
]);

export const RecordPair_NodeFlavorPrimBody_PrimCon = z.object({
  fst: NodeFlavorPrimBody,
  snd: PrimCon,
});

export const NodeFlavorBoxBody = z.literal("Pattern");

export const RecordPair_NodeFlavorBoxBody_Tree = z.lazy(() =>
  z.object({ fst: NodeFlavorBoxBody, snd: Tree })
);

export const NodeFlavorNoBody = z.enum([
  "Hole",
  "EmptyHole",
  "Ann",
  "App",
  "APP",
  "Case",
  "CaseWith",
  "TEmptyHole",
  "THole",
  "TFun",
  "TApp",
  "PatternWildcard",
  "KType",
  "KHole",
  "KFun",
]);

export const NodeBody = z.lazy(() =>
  z.union([
    z.object({
      contents: RecordPair_NodeFlavorTextBody_Name,
      tag: z.literal("TextBody"),
    }),
    z.object({
      contents: RecordPair_NodeFlavorPrimBody_PrimCon,
      tag: z.literal("PrimBody"),
    }),
    z.object({
      contents: RecordPair_NodeFlavorBoxBody_Tree,
      tag: z.literal("BoxBody"),
    }),
    z.object({ contents: NodeFlavorNoBody, tag: z.literal("NoBody") }),
  ])
);

export const Tree = z.lazy(() =>
  z.object({
    body: NodeBody,
    childTrees: z.array(Tree),
    nodeId: z.string(),
    rightChild: Tree.optional(),
  })
);

export const Def = z.object({
  name: GlobalName,
  term: Tree.optional(),
  type_: Tree,
});
export type Def = z.infer<typeof Def>;
export const ValCon = z.object({ fields: z.array(Tree), name: GlobalName });
export type ValCon = z.infer<typeof ValCon>;
export const TypeDef = z.object({
  constructors: z.array(ValCon).optional(),
  name: GlobalName,
  nameHints: z.array(z.string()),
  params: z.array(z.string()),
});
export type TypeDef = z.infer<typeof TypeDef>;
export const Module = z.object({
  defs: z.array(Def),
  editable: z.boolean(),
  modname: z.array(z.string()).min(1),
  types: z.array(TypeDef),
});
export type Module = z.infer<typeof Module>;
export const Prog = z.object({
  modules: z.array(Module),
  redoAvailable: z.boolean(),
  selection: Selection.optional(),
  undoAvailable: z.boolean(),
});
export type Prog = z.infer<typeof Prog>;
export const NoInputAction = z.enum([
  "MakeCase",
  "MakeApp",
  "MakeAPP",
  "MakeAnn",
  "RemoveAnn",
  "LetToRec",
  "Raise",
  "EnterHole",
  "RemoveHole",
  "DeleteExpr",
  "MakeFun",
  "AddInput",
  "MakeTApp",
  "RaiseType",
  "DeleteType",
  "DuplicateDef",
  "DeleteDef",
  "DeleteTypeDef",
  "DeleteCon",
  "AddConField",
  "DeleteConField",
  "DeleteTypeParam",
]);
export type NoInputAction = z.infer<typeof NoInputAction>;
export const InputAction = z.enum([
  "MakeCon",
  "MakeInt",
  "MakeChar",
  "MakeVar",
  "MakeVarSat",
  "MakeLet",
  "MakeLetRec",
  "MakeLam",
  "MakeLAM",
  "AddBranch",
  "AddBranchInt",
  "AddBranchChar",
  "DeleteBranch",
  "DeleteBranchInt",
  "DeleteBranchChar",
  "RenamePattern",
  "RenameLet",
  "RenameLam",
  "RenameLAM",
  "MakeTCon",
  "MakeTVar",
  "MakeForall",
  "RenameForall",
  "RenameDef",
  "RenameType",
  "RenameCon",
  "RenameTypeParam",
  "AddCon",
  "AddTypeParam",
]);
export type InputAction = z.infer<typeof InputAction>;
export const Action = z.union([
  z.object({ contents: NoInputAction, tag: z.literal("NoInput") }),
  z.object({ contents: InputAction, tag: z.literal("Input") }),
]);
export type Action = z.infer<typeof Action>;
export const FreeInput = z.enum([
  "FreeNone",
  "FreeVarName",
  "FreeInt",
  "FreeChar",
]);
export type FreeInput = z.infer<typeof FreeInput>;
export const Options = z.object({ free: FreeInput, opts: z.array(Option) });
export type Options = z.infer<typeof Options>;
export const EvalFullResp = z.union([
  z.object({ contents: Tree, tag: z.literal("EvalFullRespTimedOut") }),
  z.object({ contents: Tree, tag: z.literal("EvalFullRespNormal") }),
]);
export type EvalFullResp = z.infer<typeof EvalFullResp>;
export const TypeOrKind = z.union([
  z.object({ contents: Tree, tag: z.literal("Type") }),
  z.object({ contents: Tree, tag: z.literal("Kind") }),
]);
export type TypeOrKind = z.infer<typeof TypeOrKind>;
export const CreateTypeDefBody = z.object({
  ctors: z.array(z.string()),
  moduleName: z.array(z.string()).min(1),
  typeName: z.string(),
});
export type CreateTypeDefBody = z.infer<typeof CreateTypeDefBody>;
export const Level = z.enum(["Beginner", "Intermediate", "Expert"]);
export type Level = z.infer<typeof Level>;

export const schemas = {
  UUID,
  LastModified,
  SessionName,
  Session,
  PaginatedMeta,
  Paginated_Session,
  NewSessionReq,
  Option,
  GlobalName,
  NodeType,
  NodeSelection,
  DefSelection,
  TypeDefConsFieldSelection,
  TypeDefConsSelection,
  TypeDefNodeSelection,
  TypeDefSelection,
  Selection,
  ApplyActionBody,
  NodeFlavorTextBody,
  Name,
  RecordPair_NodeFlavorTextBody_Name,
  NodeFlavorPrimBody,
  PrimCon,
  RecordPair_NodeFlavorPrimBody_PrimCon,
  NodeFlavorBoxBody,
  RecordPair_NodeFlavorBoxBody_Tree,
  NodeFlavorNoBody,
  NodeBody,
  Tree,
  Def,
  ValCon,
  TypeDef,
  Module,
  Prog,
  NoInputAction,
  InputAction,
  Action,
  FreeInput,
  Options,
  EvalFullResp,
  TypeOrKind,
  CreateTypeDefBody,
  Level,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/openapi/copy-session",
    alias: "copySession",
    description: `Copy the session whose ID is given in the request body to a new session, and return the new session&#x27;s ID. Note that this method can be called at any time and is not part of the session-specific API, as it&#x27;s not scoped by the current session ID like those methods are.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.string(),
      },
    ],
    response: z.string(),
    errors: [
      {
        status: 400,
        description: `Invalid &#x60;body&#x60;`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/openapi/sessions",
    alias: "getSessionList",
    description: `Get a list of all sessions and their human-readable names, with an optional filter for matching on session names. Note that in a production system, this endpoint should obviously be authentication-scoped and only return the list of sessions that the caller is authorized to see.`,
    requestFormat: "json",
    parameters: [
      {
        name: "nameLike",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "page",
        type: "Query",
        schema: z.number().int().gt(0).lte(9223372036854776000).optional(),
      },
      {
        name: "pageSize",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional(),
      },
    ],
    response: Paginated_Session,
    errors: [
      {
        status: 400,
        description: `Invalid &#x60;pageSize&#x60; or &#x60;page&#x60; or &#x60;nameLike&#x60;`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/openapi/sessions",
    alias: "createSession",
    description: `Create a new session with the name provided in the request body, and return the new session&#x27;s ID. Note that the new session&#x27;s actual name may differ from the name provided in the body, if the requested name is invalid.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: NewSessionReq,
      },
    ],
    response: z.string(),
    errors: [
      {
        status: 400,
        description: `Invalid &#x60;body&#x60;`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/openapi/sessions/:sessionId",
    alias: "deleteSession",
    requestFormat: "json",
    parameters: [
      {
        name: "sessionId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `&#x60;sessionId&#x60; not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/openapi/sessions/:sessionId/action/apply/input",
    alias: "applyActionWithInput",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: ApplyActionBody,
      },
      {
        name: "sessionId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "action",
        type: "Query",
        schema: z.enum([
          "MakeCon",
          "MakeInt",
          "MakeChar",
          "MakeVar",
          "MakeVarSat",
          "MakeLet",
          "MakeLetRec",
          "MakeLam",
          "MakeLAM",
          "AddBranch",
          "AddBranchInt",
          "AddBranchChar",
          "DeleteBranch",
          "DeleteBranchInt",
          "DeleteBranchChar",
          "RenamePattern",
          "RenameLet",
          "RenameLam",
          "RenameLAM",
          "MakeTCon",
          "MakeTVar",
          "MakeForall",
          "RenameForall",
          "RenameDef",
          "RenameType",
          "RenameCon",
          "RenameTypeParam",
          "AddCon",
          "AddTypeParam",
        ]),
      },
    ],
    response: Prog,
    errors: [
      {
        status: 400,
        description: `Invalid &#x60;action&#x60; or &#x60;body&#x60;`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `&#x60;sessionId&#x60; not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/openapi/sessions/:sessionId/action/apply/simple",
    alias: "applyAction",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Selection,
      },
      {
        name: "sessionId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "action",
        type: "Query",
        schema: z.enum([
          "MakeCase",
          "MakeApp",
          "MakeAPP",
          "MakeAnn",
          "RemoveAnn",
          "LetToRec",
          "Raise",
          "EnterHole",
          "RemoveHole",
          "DeleteExpr",
          "MakeFun",
          "AddInput",
          "MakeTApp",
          "RaiseType",
          "DeleteType",
          "DuplicateDef",
          "DeleteDef",
          "DeleteTypeDef",
          "DeleteCon",
          "AddConField",
          "DeleteConField",
          "DeleteTypeParam",
        ]),
      },
    ],
    response: Prog,
    errors: [
      {
        status: 400,
        description: `Invalid &#x60;action&#x60; or &#x60;body&#x60;`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `&#x60;sessionId&#x60; not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/openapi/sessions/:sessionId/action/available",
    alias: "getAvailableActions",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Selection,
      },
      {
        name: "sessionId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "level",
        type: "Query",
        schema: z.enum(["Beginner", "Intermediate", "Expert"]),
      },
    ],
    response: z.array(Action),
    errors: [
      {
        status: 400,
        description: `Invalid &#x60;body&#x60; or &#x60;level&#x60;`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `&#x60;sessionId&#x60; not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/openapi/sessions/:sessionId/action/options",
    alias: "getActionOptions",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Selection,
      },
      {
        name: "sessionId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "level",
        type: "Query",
        schema: z.enum(["Beginner", "Intermediate", "Expert"]),
      },
      {
        name: "action",
        type: "Query",
        schema: z.enum([
          "MakeCon",
          "MakeInt",
          "MakeChar",
          "MakeVar",
          "MakeVarSat",
          "MakeLet",
          "MakeLetRec",
          "MakeLam",
          "MakeLAM",
          "AddBranch",
          "AddBranchInt",
          "AddBranchChar",
          "DeleteBranch",
          "DeleteBranchInt",
          "DeleteBranchChar",
          "RenamePattern",
          "RenameLet",
          "RenameLam",
          "RenameLAM",
          "MakeTCon",
          "MakeTVar",
          "MakeForall",
          "RenameForall",
          "RenameDef",
          "RenameType",
          "RenameCon",
          "RenameTypeParam",
          "AddCon",
          "AddTypeParam",
        ]),
      },
    ],
    response: Options,
    errors: [
      {
        status: 400,
        description: `Invalid &#x60;action&#x60; or &#x60;body&#x60; or &#x60;level&#x60;`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `&#x60;sessionId&#x60; not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/openapi/sessions/:sessionId/def",
    alias: "createDefinition",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.array(z.string()),
      },
      {
        name: "sessionId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "name",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: Prog,
    errors: [
      {
        status: 400,
        description: `Invalid &#x60;name&#x60; or &#x60;body&#x60;`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `&#x60;sessionId&#x60; not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/openapi/sessions/:sessionId/eval",
    alias: "eval-full",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: GlobalName,
      },
      {
        name: "sessionId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "stepLimit",
        type: "Query",
        schema: z.number().int().gte(0).lte(300).optional(),
      },
    ],
    response: EvalFullResp,
    errors: [
      {
        status: 400,
        description: `Invalid &#x60;body&#x60; or &#x60;stepLimit&#x60;`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `&#x60;sessionId&#x60; not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/openapi/sessions/:sessionId/name",
    alias: "getSessionName",
    requestFormat: "json",
    parameters: [
      {
        name: "sessionId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.string(),
    errors: [
      {
        status: 404,
        description: `&#x60;sessionId&#x60; not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "put",
    path: "/openapi/sessions/:sessionId/name",
    alias: "setSessionName",
    description: `Attempt to set the current session name. Returns the actual new session name. (Note that this may differ from the name provided.)`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.string(),
      },
      {
        name: "sessionId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.string(),
    errors: [
      {
        status: 400,
        description: `Invalid &#x60;body&#x60;`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `&#x60;sessionId&#x60; not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/openapi/sessions/:sessionId/program",
    alias: "getProgram",
    requestFormat: "json",
    parameters: [
      {
        name: "sessionId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: Prog,
    errors: [
      {
        status: 404,
        description: `&#x60;sessionId&#x60; not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/openapi/sessions/:sessionId/redo",
    alias: "redo",
    requestFormat: "json",
    parameters: [
      {
        name: "sessionId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: Prog,
    errors: [
      {
        status: 404,
        description: `&#x60;sessionId&#x60; not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/openapi/sessions/:sessionId/selection",
    alias: "getTypeOrKind",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Selection,
      },
      {
        name: "sessionId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: TypeOrKind,
    errors: [
      {
        status: 400,
        description: `Invalid &#x60;body&#x60;`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `&#x60;sessionId&#x60; not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/openapi/sessions/:sessionId/typedef",
    alias: "createTypeDef",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CreateTypeDefBody,
      },
      {
        name: "sessionId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: Prog,
    errors: [
      {
        status: 400,
        description: `Invalid &#x60;body&#x60;`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `&#x60;sessionId&#x60; not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/openapi/sessions/:sessionId/undo",
    alias: "undo",
    requestFormat: "json",
    parameters: [
      {
        name: "sessionId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: Prog,
    errors: [
      {
        status: 404,
        description: `&#x60;sessionId&#x60; not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/openapi/version",
    alias: "getVersion",
    requestFormat: "json",
    response: z.string(),
  },
]);

export function createApiHooks(baseUrl: string, options?: ZodiosOptions) {
  const client = new Zodios(baseUrl, endpoints, options);
  return new ZodiosHooks("primer-api", client);
}
