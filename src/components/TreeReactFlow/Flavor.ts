import {
  NodeFlavorBoxBody,
  NodeFlavorNoBody,
  NodeFlavorPrimBody,
  NodeFlavorTextBody,
} from "@/primer-api";
import "./reactflow.css";

export type NodeFlavor =
  | NodeFlavorTextBody
  | NodeFlavorPrimBody
  | NodeFlavorBoxBody
  | NodeFlavorNoBody;

export const flavorClasses = (flavor: NodeFlavor): string => {
  switch (flavor) {
    case "Hole":
      return "border-red-tertiary ring-red-tertiary bg-white-primary".concat(
        " hover:ring hover:ring-4 hover:ring-offset-4 hover:ring-red-tertiary"
      );
    case "EmptyHole":
      return "border-red-tertiary ring-red-tertiary bg-white-primary".concat(
        " hover:ring hover:ring-4 hover:ring-offset-4 hover:ring-red-tertiary"
      );
    case "Ann":
      return "border-black-primary ring-black-primary bg-black-primary".concat(
        " hover:ring hover:ring-4 hover:ring-offset-4 hover:ring-black-primary"
      );
    case "App":
      return "border-blue-tertiary ring-blue-tertiary bg-blue-tertiary".concat(
        " hover:ring hover:ring-4 hover:ring-offset-4 hover:ring-blue-tertiary"
      );
    case "APP":
      return "border-yellow-secondary ring-yellow-secondary bg-yellow-secondary".concat(
        " hover:ring hover:ring-4 hover:ring-offset-4 hover:ring-yellow-secondary"
      );
    case "Con":
      return "border-green-primary ring-green-primary bg-white-primary".concat(
        " hover:ring hover:ring-4 hover:ring-offset-4 hover:ring-green-primary"
      );
    case "Lam":
      return "border-blue-primary ring-blue-primary bg-white-primary".concat(
        " hover:ring hover:ring-4 hover:ring-offset-4 hover:ring-blue-primary"
      );
    case "LAM":
      return "border-black-primary ring-black-primary bg-white-primary".concat(
        " hover:ring hover:ring-4 hover:ring-offset-4 hover:ring-black-primary"
      );
    case "GlobalVar":
      return "border-blue-quaternary ring-blue-quaternary bg-white-primary".concat(
        " hover:ring hover:ring-4 hover:ring-offset-4 hover:ring-blue-quaternary"
      );
    case "LocalVar":
      return "border-blue-quaternary ring-blue-quaternary bg-white-primary".concat(
        " hover:ring hover:ring-4 hover:ring-offset-4 hover:ring-blue-quaternary"
      );
    case "Let":
      return "border-blue-quaternary ring-blue-quaternary bg-blue-quaternary".concat(
        " hover:ring hover:ring-4 hover:ring-offset-4 hover:ring-blue-quaternary"
      );
    case "LetType":
      return "border-blue-quaternary ring-blue-quaternary bg-blue-quaternary".concat(
        " hover:ring hover:ring-4 hover:ring-offset-4 hover:ring-blue-quaternary"
      );
    case "Letrec":
      return "border-blue-quaternary ring-blue-quaternary bg-blue-quaternary".concat(
        " hover:ring hover:ring-4 hover:ring-offset-4 hover:ring-blue-quaternary"
      );
    case "Case":
      return "border-yellow-primary ring-yellow-primary bg-yellow-primary".concat(
        " hover:ring hover:ring-4 hover:ring-offset-4 hover:ring-yellow-primary"
      );

    // Note: not selectable.
    case "CaseWith":
      return "border-yellow-primary ring-yellow-primary bg-yellow-primary";

    case "PrimCon":
      return "border-black-primary ring-black-primary bg-white-primary".concat(
        " hover:ring hover:ring-4 hover:ring-offset-4 hover:ring-black-primary"
      );
    case "TEmptyHole":
      return "border-black-primary ring-black-primary bg-white-primary".concat(
        " hover:ring hover:ring-4 hover:ring-offset-4 hover:ring-black-primary"
      );
    case "THole":
      return "border-black-primary ring-black-primary bg-white-primary".concat(
        " hover:ring hover:ring-4 hover:ring-offset-4 hover:ring-black-primary"
      );
    case "TCon":
      return "border-black-primary ring-black-primary bg-white-primary".concat(
        " hover:ring hover:ring-4 hover:ring-offset-4 hover:ring-black-primary"
      );
    case "TFun":
      return "border-black-primary ring-black-primary bg-black-primary".concat(
        " hover:ring hover:ring-4 hover:ring-offset-4 hover:ring-black-primary"
      );
    case "TVar":
      return "border-black-primary ring-black-primary bg-white-primary".concat(
        " hover:ring hover:ring-4 hover:ring-offset-4 hover:ring-black-primary"
      );
    case "TApp":
      return "border-black-primary ring-black-primary bg-black-primary".concat(
        " hover:ring hover:ring-4 hover:ring-offset-4 hover:ring-black-primary"
      );
    case "TForall":
      return "border-black-primary ring-black-primary bg-white-primary".concat(
        " hover:ring hover:ring-4 hover:ring-offset-4 hover:ring-black-primary"
      );
    case "TLet":
      return "border-black-primary ring-black-primary bg-black-primary".concat(
        " hover:ring hover:ring-4 hover:ring-offset-4 hover:ring-black-primary"
      );

    // Note: most parts of patterns aren't selectable.

    // This node's background is transparent, so that we can draw
    // edges over it. Otherwise, we'd need to special-case the
    // z-index of edges when drawn inside a pattern.
    case "Pattern":
      return "border-yellow-primary ring-yellow-primary";

    case "PatternCon":
      return "border-green-primary ring-green-primary bg-white-primary";
    case "PatternBind":
      return "border-blue-quaternary ring-blue-quaternary bg-white-primary".concat(
        " hover:ring hover:ring-4 hover:ring-offset-4 hover:ring-blue-quaternary"
      );
    case "PatternApp":
      return "border-blue-tertiary ring-blue-tertiary bg-blue-tertiary";
  }
};

export const flavorContentClasses = (
  flavor: NodeFlavorTextBody | NodeFlavorPrimBody | NodeFlavorNoBody
): string => {
  switch (flavor) {
    case "Hole":
      return "text-blue-primary";
    case "EmptyHole":
      return "text-blue-primary";
    case "Ann":
      return "text-white-primary";
    case "App":
      return "text-white-primary";
    case "APP":
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
    case "TEmptyHole":
      return "text-blue-primary";
    case "THole":
      return "text-blue-primary";
    case "TCon":
      return "text-blue-primary";
    case "TFun":
      return "text-white-primary";
    case "TVar":
      return "text-blue-primary";
    case "TApp":
      return "text-white-primary";
    case "TForall":
      return "text-blue-primary";
    case "TLet":
      return "text-white-primary";
    case "PatternCon":
      return "text-blue-primary";
    case "PatternBind":
      return "text-blue-primary";
    case "PatternApp":
      return "text-white-primary";
  }
};

export const flavorLabelClasses = (flavor: NodeFlavor): string => {
  switch (flavor) {
    case "Hole":
      return "font-code bg-red-tertiary border-red-tertiary text-white-primary";
    case "EmptyHole":
      return "font-code bg-red-tertiary border-red-tertiary text-white-primary";
    case "Ann":
      return "font-code bg-black-primary border-black-primary text-white-primary";
    case "App":
      return "font-code bg-blue-tertiary border-blue-tertiary text-white-primary";
    case "APP":
      return "font-code bg-yellow-secondary border-yellow-secondary text-white-primary";
    case "Con":
      return "bg-green-primary border-green-primary text-white-primary";
    case "Lam":
      return "font-code bg-blue-primary border-blue-primary text-white-primary";
    case "LAM":
      return "font-code bg-black-primary border-black-primary text-white-primary";
    case "GlobalVar":
      return "bg-blue-quaternary border-blue-quaternary text-white-primary";
    case "LocalVar":
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
    case "TEmptyHole":
      return "font-code bg-black-primary border-black-primary text-white-primary";
    case "THole":
      return "font-code bg-black-primary border-black-primary text-white-primary";
    case "TCon":
      return "bg-black-primary border-black-primary text-white-primary";
    case "TFun":
      return "font-code bg-black-primary border-black-primary text-white-primary";
    case "TVar":
      return "bg-black-primary border-black-primary text-white-primary";
    case "TApp":
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
    case "PatternApp":
      return "font-code bg-blue-tertiary border-blue-tertiary text-white-primary";
  }
};

export const flavorEdgeClasses = (flavor: NodeFlavor): string => {
  switch (flavor) {
    case "Hole":
      return "stroke-red-tertiary stroke-[0.25rem] z-10";
    case "EmptyHole":
      return "stroke-red-tertiary stroke-[0.25rem] z-10";
    case "Ann":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "App":
      return "stroke-blue-tertiary stroke-[0.25rem] z-10";
    case "APP":
      return "stroke-yellow-secondary stroke-[0.25rem] z-10";
    case "Con":
      return "stroke-green-primary stroke-[0.25rem] z-10";
    case "Lam":
      return "stroke-blue-primary stroke-[0.25rem] z-10";
    case "LAM":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "GlobalVar":
      return "stroke-blue-quaternary stroke-[0.25rem] z-10";
    case "LocalVar":
      return "stroke-blue-quaternary stroke-[0.25rem] z-10";
    case "Let":
      return "stroke-blue-quaternary stroke-[0.25rem] z-10";
    case "LetType":
      return "stroke-blue-quaternary stroke-[0.25rem] z-10";
    case "Letrec":
      return "stroke-blue-quaternary stroke-[0.25rem] z-10";
    case "Case":
      return "stroke-yellow-primary stroke-[0.25rem] z-10";
    case "CaseWith":
      return "stroke-yellow-primary stroke-[0.25rem] z-10";
    case "PrimCon":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "TEmptyHole":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "THole":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "TCon":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "TFun":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "TVar":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "TApp":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "TForall":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "TLet":
      return "stroke-black-primary stroke-[0.25rem] z-10";
    case "Pattern":
      return "stroke-yellow-primary stroke-[0.25rem] z-10";
    case "PatternCon":
      return "stroke-green-primary stroke-[0.25rem] z-10";
    case "PatternBind":
      return "stroke-blue-quaternary stroke-[0.25rem] z-10";
    case "PatternApp":
      return "stroke-blue-tertiary stroke-[0.25rem] z-10";
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
      return "$";
    case "APP":
      return "@";
    case "Con":
      return "V";
    case "Lam":
      return "λ";
    case "LAM":
      return "Λ";
    case "GlobalVar":
      return "Var";
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
      return "Var";
    case "TApp":
      return "@";
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
    case "PatternApp":
      return "$";
  }
};

export const noBodyFlavorContents = (flavor: NodeFlavorNoBody): string => {
  switch (flavor) {
    case "Ann":
      return "type annotation";
    case "App":
      return "apply";
    case "APP":
      return "apply type";
    case "Case":
      return "match";
    case "CaseWith":
      return "with";
    case "TFun":
      return "function type";
    case "TApp":
      return "apply type";
    case "PatternApp":
      return "apply";
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
