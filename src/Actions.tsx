import { InputAction, NoInputAction, Level } from "@/primer-api";
import type { Name } from "@/components/ActionPanelButton";

export type ActionType = "Primary" | "Destructive";

export const actionName = (action: NoInputAction | InputAction): Name => {
  const code = (text: string): Name => {
    return { text: text, style: "code" };
  };
  const prose = (text: string): Name => {
    return { text: text, style: "prose" };
  };
  switch (action) {
    case "MakeCase":
      return code("m");
    case "MakeApp":
      return code("$");
    case "MakeAPP":
      return code("@");
    case "MakeAnn":
      return code(":");
    case "RemoveAnn":
      return prose("⌫:");
    case "LetToRec":
      return prose("rec");
    case "Raise":
      return prose("↑");
    case "EnterHole":
      return prose("h");
    case "RemoveHole":
      return prose("e");
    case "DeleteExpr":
      return prose("⌫");
    case "MakeFun":
      return code("→");
    case "AddInput":
      return code("→A→");
    case "MakeTApp":
      return code("$");
    case "RaiseType":
      return prose("↑");
    case "DeleteDef":
      return prose("⌫");
    case "DeleteTypeDef":
      return prose("⌫");
    case "DuplicateDef":
      return prose("d");
    case "DeleteType":
      return prose("⌫");
    case "MakeCon":
      return code("V ? ?");
    case "MakeInt":
      return code("1");
    case "MakeChar":
      return code('"c"');
    case "MakeVar":
      return code("x");
    case "MakeVarSat":
      return code("f $ ?");
    case "MakeLet":
      return code("=");
    case "MakeLetRec":
      return code("=,=");
    case "MakeLam":
      return code("λx");
    case "MakeLAM":
      return code("Λx");
    case "AddBranch":
      return prose("＋");
    case "AddBranchInt":
      return prose("＋");
    case "AddBranchChar":
      return prose("＋");
    case "DeleteBranch":
      return prose("－");
    case "DeleteBranchInt":
      return prose("－");
    case "DeleteBranchChar":
      return prose("－");
    case "RenamePattern":
      return prose("r");
    case "RenameLet":
      return prose("r");
    case "RenameLam":
      return prose("r");
    case "RenameLAM":
      return prose("r");
    case "MakeTCon":
      return code("T");
    case "MakeTVar":
      return code("t");
    case "MakeForall":
      return code("∀");
    case "RenameForall":
      return prose("r");
    case "RenameDef":
      return prose("r");
    case "RenameType":
      return prose("r");
    case "AddCon":
      return prose("+");
    case "DeleteCon":
      return prose("⌫");
    case "RenameCon":
      return prose("r");
    case "RenameTypeParam":
      return prose("r");
    case "AddTypeParam":
      return prose("t");
    case "DeleteTypeParam":
      return prose("⌫");
    case "AddConField":
      return prose("+");
    case "DeleteConField":
      return prose("p⌫");
  }
};

export const actionDescription = (
  action: NoInputAction | InputAction,
  level: Level
): string => {
  switch (action) {
    case "MakeCase":
      switch (level) {
        case "Beginner":
          return "Match a variable with its value";
        case "Intermediate":
          return "Match a variable with its value";
        case "Expert":
          return "Pattern match";
      }
    // TODO ESLint isn't smart enough to see that this is fine
    // even though it correctly flags that a `break` or `return` here would be unreachable
    // https://github.com/typescript-eslint/typescript-eslint/issues/3455
    // eslint-disable-next-line no-fallthrough
    case "MakeApp":
      return "Apply function";
    case "MakeAPP":
      return "Apply type";
    case "MakeAnn":
      return "Annotate this expression with a type";
    case "RemoveAnn":
      return "Remove this annotation";
    case "LetToRec":
      return "Make this let recursive";
    case "Raise":
      return "Replace parent with this subtree";
    case "EnterHole":
      return "Make this hole into a non-empty hole";
    case "RemoveHole":
      return "Convert this into a normal expression";
    case "DeleteExpr":
      return "Delete this expression";
    case "MakeFun":
      return "Construct a function type";
    case "AddInput":
      return "Add an input to this function";
    case "MakeTApp":
      return "Construct a type application";
    case "RaiseType":
      return "Replace parent with this subtree";
    case "DeleteDef":
      return "Delete this definition";
    case "DeleteTypeDef":
      return "Delete this type definition";
    case "DuplicateDef":
      return "Duplicate this definition";
    case "DeleteType":
      return "Delete this type";
    case "MakeCon":
      return "Use a value constructor";
    case "MakeInt":
      return "Insert a whole number";
    case "MakeChar":
      return "Insert a character";
    case "MakeVar":
      return "Use a variable";
    case "MakeVarSat":
      return "Apply a function to arguments";
    case "MakeLet":
      return "Make a let binding";
    case "MakeLetRec":
      return "Make a recursive let binding";
    case "MakeLam":
      return "Make a function with an input";
    case "MakeLAM":
      return "Make a type abstraction";
    case "AddBranch":
      return "Add a branch to this match";
    case "AddBranchInt":
      return "Add a branch to this match";
    case "AddBranchChar":
      return "Add a branch to this match";
    case "DeleteBranch":
      return "Remove a branch from this match";
    case "DeleteBranchInt":
      return "Remove a branch from this match";
    case "DeleteBranchChar":
      return "Remove a branch from this match";
    case "RenamePattern":
      return "Rename this pattern variable";
    case "RenameLet":
      return "Rename this let binding";
    case "RenameLam":
      return "Rename this input variable";
    case "RenameLAM":
      return "Rename this type variable";
    case "MakeTCon":
      return "Use a type constructor";
    case "MakeTVar":
      return "Use a type variable";
    case "MakeForall":
      return "Construct a polymorphic type";
    case "RenameForall":
      return "Rename this type variable";
    case "RenameDef":
      return "Rename this definition";
    case "RenameType":
      return "Rename this type";
    case "AddCon":
      return "Add a constructor to this type";
    case "DeleteCon":
      return "Delete this constructor";
    case "RenameCon":
      return "Rename this constructor";
    case "RenameTypeParam":
      return "Rename this parameter";
    case "AddTypeParam":
      return "Add a type parameter";
    case "DeleteTypeParam":
      return "Delete this parameter";
    case "AddConField":
      return "Add a parameter to this constructor";
    case "DeleteConField":
      return "Delete this parameter";
  }
};

export const actionType = (action: NoInputAction | InputAction): ActionType => {
  switch (action) {
    case "MakeCase":
      return "Primary";
    case "MakeApp":
      return "Primary";
    case "MakeAPP":
      return "Primary";
    case "MakeAnn":
      return "Primary";
    case "RemoveAnn":
      return "Destructive";
    case "LetToRec":
      return "Primary";
    case "Raise":
      return "Destructive";
    case "EnterHole":
      return "Primary";
    case "RemoveHole":
      return "Primary";
    case "DeleteExpr":
      return "Destructive";
    case "MakeFun":
      return "Primary";
    case "AddInput":
      return "Primary";
    case "MakeTApp":
      return "Primary";
    case "RaiseType":
      return "Destructive";
    case "DeleteDef":
      return "Destructive";
    case "DeleteTypeDef":
      return "Destructive";
    case "DuplicateDef":
      return "Primary";
    case "DeleteType":
      return "Destructive";
    case "MakeCon":
      return "Primary";
    case "MakeInt":
      return "Primary";
    case "MakeChar":
      return "Primary";
    case "MakeVar":
      return "Primary";
    case "MakeVarSat":
      return "Primary";
    case "MakeLet":
      return "Primary";
    case "MakeLetRec":
      return "Primary";
    case "MakeLam":
      return "Primary";
    case "MakeLAM":
      return "Primary";
    case "AddBranch":
      return "Primary";
    case "AddBranchInt":
      return "Primary";
    case "AddBranchChar":
      return "Primary";
    case "DeleteBranch":
      return "Destructive";
    case "DeleteBranchInt":
      return "Destructive";
    case "DeleteBranchChar":
      return "Destructive";
    case "RenamePattern":
      return "Primary";
    case "RenameLet":
      return "Primary";
    case "RenameLam":
      return "Primary";
    case "RenameLAM":
      return "Primary";
    case "MakeTCon":
      return "Primary";
    case "MakeTVar":
      return "Primary";
    case "MakeForall":
      return "Primary";
    case "RenameForall":
      return "Primary";
    case "RenameDef":
      return "Primary";
    case "RenameType":
      return "Primary";
    case "AddCon":
      return "Primary";
    case "DeleteCon":
      return "Destructive";
    case "RenameCon":
      return "Primary";
    case "RenameTypeParam":
      return "Primary";
    case "AddTypeParam":
      return "Primary";
    case "DeleteTypeParam":
      return "Destructive";
    case "AddConField":
      return "Primary";
    case "DeleteConField":
      return "Destructive";
  }
};
