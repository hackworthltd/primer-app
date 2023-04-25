import {
  NodeFlavorBoxBody,
  NodeFlavorNoBody,
  NodeFlavorPrimBody,
  NodeFlavorTextBody,
} from "@/primer-api";
import classNames from "classnames";
import "./reactflow.css";

export type NodeFlavor =
  | NodeFlavorTextBody
  | NodeFlavorPrimBody
  | NodeFlavorBoxBody
  | NodeFlavorNoBody;

export const commonHoverClasses = "hover:ring hover:ring-4 hover:ring-offset-4";

export const flavorClasses = (flavor: NodeFlavor): string => {
  // TODO total hack
  if (isDefinition(flavor)) {
    return flavorClasses0(flavor).replace("bg", "").concat(" bg-white-primary");
  } else {
    return flavorClasses0(flavor);
  }
};
export const flavorClasses0 = (flavor: NodeFlavor): string => {
  switch (flavor) {
    case "Hole":
    case "THole":
      return classNames(
        "border-red-tertiary ring-red-tertiary bg-white-primary",
        "hover:ring-red-tertiary",
        commonHoverClasses
      );
    case "EmptyHole":
    case "TEmptyHole":
      return classNames(
        "border-red-tertiary ring-red-tertiary bg-white-primary",
        "hover:ring-red-tertiary",
        commonHoverClasses
      );
    case "Ann":
      return classNames(
        "border-black-primary ring-black-primary bg-black-primary",
        "hover:ring-black-primary",
        commonHoverClasses
      );
    case "App":
    case "APP":
    case "TApp":
      return classNames(
        "border-blue-tertiary ring-blue-tertiary bg-blue-tertiary",
        "hover:ring-blue-tertiary",
        commonHoverClasses
      );
    // case "APP":
    // case "TApp":
    //   return classNames(
    //     "border-yellow-secondary ring-yellow-secondary bg-yellow-secondary",
    //     "hover:ring-yellow-secondary",
    //     commonHoverClasses
    //   );
    case "Con":
    case "TCon":
      return classNames(
        "border-green-primary ring-green-primary bg-green-primary",
        "hover:ring-green-primary",
        commonHoverClasses
      );
    case "Lam":
      return classNames(
        "border-blue-primary ring-blue-primary bg-blue-primary",
        "hover:ring-blue-primary",
        commonHoverClasses
      );
    case "LAM":
      return classNames(
        "border-black-primary ring-black-primary bg-black-primary",
        "hover:ring-black-primary",
        commonHoverClasses
      );
    case "GlobalVar":
    case "LocalVar":
    case "TVar":
      return classNames(
        "border-blue-quaternary ring-blue-quaternary bg-blue-quaternary",
        "hover:ring-blue-quaternary",
        commonHoverClasses
      );
    case "Let":
      return classNames(
        "border-blue-quaternary ring-blue-quaternary bg-blue-quaternary",
        "hover:ring-blue-quaternary",
        commonHoverClasses
      );
    case "LetType":
      return classNames(
        "border-blue-quaternary ring-blue-quaternary bg-blue-quaternary",
        "hover:ring-blue-quaternary",
        commonHoverClasses
      );
    case "Letrec":
      return classNames(
        "border-blue-quaternary ring-blue-quaternary bg-blue-quaternary",
        "hover:ring-blue-quaternary",
        commonHoverClasses
      );
    case "Case":
      return classNames(
        "border-yellow-primary ring-yellow-primary bg-yellow-primary",
        "hover:ring-yellow-primary",
        commonHoverClasses
      );

    // Note: not selectable.
    case "CaseWith":
      return "border-yellow-primary ring-yellow-primary bg-yellow-primary";

    case "PrimCon":
      return classNames(
        "border-black-primary ring-black-primary bg-black-primary",
        "hover:ring-black-primary",
        commonHoverClasses
      );
    case "TFun":
      return classNames(
        "border-black-primary ring-black-primary bg-black-primary",
        "hover:ring-black-primary",
        commonHoverClasses
      );
    case "TForall":
      return classNames(
        "border-black-primary ring-black-primary bg-black-primary",
        "hover:ring-black-primary",
        commonHoverClasses
      );
    case "TLet":
      return classNames(
        "border-black-primary ring-black-primary bg-black-primary",
        "hover:ring-black-primary",
        commonHoverClasses
      );

    // Note: most parts of patterns aren't selectable.

    // This node's background is transparent, so that we can draw
    // edges over it. Otherwise, we'd need to special-case the
    // z-index of edges when drawn inside a pattern.
    case "Pattern":
      return "border-yellow-primary ring-yellow-primary";

    case "PatternCon":
      return "border-green-primary ring-green-primary bg-green-primary";
    case "PatternBind":
      return classNames(
        "border-blue-quaternary ring-blue-quaternary bg-blue-quaternary",
        "hover:ring-blue-quaternary",
        commonHoverClasses
      );
  }
};

export const flavorContentClasses = (
  flavor: NodeFlavorTextBody | NodeFlavorPrimBody | NodeFlavorNoBody
): string => {
  switch (flavor) {
    case "Hole":
    case "THole":
      return "text-blue-primary";
    case "EmptyHole":
    case "TEmptyHole":
      return "text-blue-primary";
    case "Ann":
      return "text-white-primary";
    case "App":
      return "text-white-primary";
    case "APP":
    case "TApp":
      return "text-white-primary";
    case "Con":
      return "text-blue-primary";
    case "Lam":
      return "text-blue-primary";
    case "LAM":
      return "text-blue-primary";
    case "GlobalVar":
      return "text-blue-primary";
    case "LocalVar":
      return "text-blue-primary";
    case "Let":
      return "text-white-primary";
    case "LetType":
      return "text-white-primary";
    case "Letrec":
      return "text-white-primary";
    case "Case":
      return "text-white-primary";
    case "CaseWith":
      return "text-white-primary";
    case "PrimCon":
      return "text-blue-primary";
    case "TCon":
      return "text-blue-primary";
    case "TFun":
      return "text-white-primary";
    case "TVar":
      return "text-blue-primary";
    case "TForall":
      return "text-blue-primary";
    case "TLet":
      return "text-white-primary";
    case "PatternCon":
      return "text-blue-primary";
    case "PatternBind":
      return "text-blue-primary";
  }
};

export const flavorLabelClasses = (flavor: NodeFlavor): string => {
  switch (flavor) {
    case "Hole":
    case "THole":
      return "font-code bg-red-tertiary border-red-tertiary text-white-primary";
    case "EmptyHole":
    case "TEmptyHole":
      return "font-code bg-red-tertiary border-red-tertiary text-white-primary";
    case "Ann":
      return "font-code bg-black-primary border-black-primary text-white-primary";
    case "App":
    case "APP":
    case "TApp":
      return "font-code bg-blue-tertiary border-blue-tertiary text-white-primary";
    case "Con":
    case "TCon":
      return "bg-green-primary border-green-primary text-white-primary";
    case "Lam":
      return "font-code bg-blue-primary border-blue-primary text-white-primary";
    case "LAM":
      return "font-code bg-black-primary border-black-primary text-white-primary";
    case "GlobalVar":
    case "LocalVar":
    case "TVar":
      return "bg-blue-quaternary border-blue-quaternary text-white-primary";
    case "Let":
      return "font-code bg-blue-quaternary border-blue-quaternary text-white-primary";
    case "LetType":
      return "font-code bg-blue-quaternary border-blue-quaternary text-white-primary";
    case "Letrec":
      return "font-code bg-blue-quaternary border-blue-quaternary text-white-primary";
    case "Case":
      return "font-code bg-yellow-primary border-yellow-primary text-white-primary";
    case "CaseWith": // Special case: we hide this label.
      return "hidden font-code bg-yellow-primary border-yellow-primary text-white-primary";
    case "PrimCon":
      return "bg-black-primary border-black-primary text-white-primary";
    case "TFun":
      return "font-code bg-black-primary border-black-primary text-white-primary";
    case "TForall":
      return "font-code bg-black-primary border-black-primary text-white-primary";
    case "TLet":
      return "font-code bg-black-primary border-black-primary text-white-primary";
    case "Pattern":
      return "bg-yellow-primary border-yellow-primary text-white-primary";
    case "PatternCon":
      return "bg-green-primary border-green-primary text-white-primary";
    case "PatternBind":
      return "bg-blue-quaternary border-blue-quaternary text-white-primary";
  }
};

export const flavorEdgeClasses = (flavor: NodeFlavor): string => {
  switch (flavor) {
    case "Hole":
    case "THole":
      return "stroke-red-tertiary";
    case "EmptyHole":
    case "TEmptyHole":
      return "stroke-red-tertiary";
    case "Ann":
      return "stroke-black-primary";
    case "App":
    case "APP":
    case "TApp":
      return "stroke-blue-tertiary";
    case "Con":
    case "TCon":
      return "stroke-green-primary";
    case "Lam":
      return "stroke-blue-primary";
    case "LAM":
      return "stroke-black-primary";
    case "GlobalVar":
    case "LocalVar":
    case "TVar":
      return "stroke-blue-quaternary";
    case "Let":
      return "stroke-blue-quaternary";
    case "LetType":
      return "stroke-blue-quaternary";
    case "Letrec":
      return "stroke-blue-quaternary";
    case "Case":
      return "stroke-yellow-primary";
    case "CaseWith":
      return "stroke-yellow-primary";
    case "PrimCon":
      return "stroke-black-primary";
    case "TFun":
      return "stroke-black-primary";
    case "TForall":
      return "stroke-black-primary";
    case "TLet":
      return "stroke-black-primary";
    case "Pattern":
      return "stroke-yellow-primary";
    case "PatternCon":
      return "stroke-green-primary";
    case "PatternBind":
      return "stroke-blue-quaternary";
  }
};

export const flavorLabel = (flavor: NodeFlavor): string => {
  switch (flavor) {
    case "Hole":
      return "{?}";
    case "EmptyHole":
      return "?";
    case "Ann":
      return ":";
    case "App":
    case "APP":
    case "TApp":
      return "←";
    case "Con":
      return "V";
    case "Lam":
      return "λ";
    case "LAM":
      return "Λ";
    case "GlobalVar":
    case "LocalVar":
      return "Var";
    case "Let":
      return "let";
    case "LetType":
      return "let type";
    case "Letrec":
      return "let rec";
    case "Case":
      return "m";
    case "CaseWith":
      return "w";
    case "PrimCon":
      return "V";
    case "TEmptyHole":
      return "?";
    case "THole":
      return "{?}";
    case "TCon":
      return "T";
    case "TFun":
      return "→";
    case "TVar":
      return "TVar";
    case "TForall":
      return "∀";
    case "TLet":
      return "let";
    case "Pattern":
      return "P";
    case "PatternCon":
      return "V";
    case "PatternBind":
      return "Var";
  }
};

export const noBodyFlavorContents = (flavor: NodeFlavorNoBody): string => {
  switch (flavor) {
    case "Ann":
      return "type annotation";
    case "App":
      return "apply";
    case "APP":
    case "TApp":
      return "apply type";
    case "Case":
      return "match";
    case "CaseWith":
      return "with";
    case "TFun":
      return "function type";
    case "Hole":
      return "{?}";
    case "EmptyHole":
      return "?";
    case "TEmptyHole":
      return "?";
    case "THole":
      return "{?}";
  }
};

export const boxFlavorBackground = (flavor: NodeFlavorBoxBody): string => {
  switch (flavor) {
    case "Pattern":
      return "bg-yellow-primary";
  }
};

// TODO names
// TODO get from backend? this comes down to whether these are from `Expr` or `Type`
export const isTypeLevel = (flavor: NodeFlavor): "term" | "type" => {
  switch (flavor) {
    case "Con":
    case "Lam":
    case "LAM":
    case "Let":
    case "Letrec":
    case "PatternBind":
    case "PatternCon":
    case "LetType":
    case "GlobalVar":
    case "LocalVar":
    case "PrimCon":
    case "Pattern":
    case "Hole":
    case "EmptyHole":
    case "Ann":
    case "App":
    case "APP":
    case "Case":
    case "CaseWith":
      return "term";
    case "TCon":
    case "TVar":
    case "TForall":
    case "TLet":
    case "TEmptyHole":
    case "THole":
    case "TFun":
    case "TApp":
      return "type";
  }
};
export const typeOrTermClasses = (x: "term" | "type"): string => {
  switch (x) {
    case "term":
      return "rounded-3xl";
    case "type":
      return "";
  }
};
// NB these are (presumably) exactly the nodes where we offer "rename"-related actions
export const isDefinition = (flavor: NodeFlavor): boolean => {
  switch (flavor) {
    case "Let":
    case "Letrec":
    case "Lam":
    case "LAM":
    case "PatternBind":
    case "LetType":
    case "TForall":
      return true;
    case "Con":
    case "PatternCon":
    case "TCon":
    case "TVar":
    case "TLet":
    case "GlobalVar":
    case "LocalVar":
    case "PrimCon":
    case "Pattern":
    case "Hole":
    case "EmptyHole":
    case "Ann":
    case "App":
    case "APP":
    case "Case":
    case "CaseWith":
    case "TEmptyHole":
    case "THole":
    case "TFun":
    case "TApp":
      return false;
  }
};
export const definitionClasses = (x: boolean): string => {
  switch (x) {
    case true:
      return "bg-white-primary";
    // return "bg-blue-tertiary";
    case false:
      return "";
    // return "bg-blue-tertiary";
  }
};

// case "Con":
// case "Lam":
// case "LAM":
// case "Let":
// case "Letrec":
// case "PatternBind":
// case "PatternCon":
// case "LetType":
// case "TCon":
// case "TVar":
// case "TForall":
// case "TLet":
// case "GlobalVar":
// case "LocalVar":
// case "PrimCon":
// case "Pattern":
// case "Hole":
// case "EmptyHole":
// case "Ann":
// case "App":
// case "APP":
// case "Case":
// case "CaseWith":
// case "PatternApp":
// case "TEmptyHole":
// case "THole":
// case "TFun":
// case "TApp":
