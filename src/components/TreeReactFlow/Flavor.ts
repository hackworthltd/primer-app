import {
  NodeFlavorBoxBody,
  NodeFlavorNoBody,
  NodeFlavorPrimBody,
  NodeFlavorTextBody,
} from "@/primer-api";
import classNames from "classnames";
import "./reactflow.css";
import { Label } from "./Types";

export type NodeFlavor =
  | NodeFlavorTextBody
  | NodeFlavorPrimBody
  | NodeFlavorBoxBody
  | NodeFlavorNoBody;

export const commonHoverClasses = "hover:ring hover:ring-4 hover:ring-offset-4";

export const flavorClasses = (flavor: NodeFlavor): string =>
  classNames(
    sortClasses(flavorSort(flavor)),
    (() => {
      switch (flavor) {
        case "Hole":
          return classNames(
            "border-red-tertiary ring-red-tertiary bg-white-primary",
            "hover:ring-red-tertiary",
            commonHoverClasses
          );
        case "EmptyHole":
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
          return classNames(
            "border-blue-tertiary ring-blue-tertiary bg-blue-tertiary",
            "hover:ring-blue-tertiary",
            commonHoverClasses
          );
        case "APP":
          return classNames(
            "border-blue-tertiary ring-blue-tertiary bg-blue-tertiary",
            "hover:ring-blue-tertiary",
            commonHoverClasses
          );
        case "Con":
          return classNames(
            "border-green-primary ring-green-primary bg-white-primary",
            "hover:ring-green-primary",
            commonHoverClasses
          );
        case "KHole":
          return classNames(
            "border-grey-tertiary ring-grey-tertiary bg-white-primary",
            "hover:ring-grey-tertiary",
            commonHoverClasses
          );
        case "KType":
          return classNames(
            "border-grey-tertiary ring-grey-tertiary bg-grey-tertiary",
            "hover:ring-grey-tertiary",
            commonHoverClasses
          );
        case "KFun":
          return classNames(
            "border-grey-tertiary ring-grey-tertiary bg-grey-tertiary",
            "hover:ring-grey-tertiary",
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
            "border-blue-secondary ring-blue-secondary bg-blue-secondary",
            "hover:ring-blue-secondary",
            commonHoverClasses
          );
        case "GlobalVar":
          return classNames(
            "border-blue-quaternary ring-blue-quaternary bg-white-primary",
            "hover:ring-blue-quaternary",
            commonHoverClasses
          );
        case "VarBind":
        case "LocalVar":
          return classNames(
            "border-blue-quaternary ring-blue-quaternary bg-white-primary",
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
            "border-green-primary ring-green-primary bg-white-primary",
            "hover:ring-green-primary",
            commonHoverClasses
          );
        case "TEmptyHole":
          return classNames(
            "border-red-tertiary ring-red-tertiary bg-white-primary",
            "hover:ring-red-tertiary",
            commonHoverClasses
          );
        case "THole":
          return classNames(
            "border-red-tertiary ring-red-tertiary bg-white-primary",
            "hover:ring-red-tertiary",
            commonHoverClasses
          );
        case "TCon":
          return classNames(
            "border-green-primary ring-green-primary bg-white-primary",
            "hover:ring-green-primary",
            commonHoverClasses
          );
        case "TFun":
          return classNames(
            "border-blue-primary ring-blue-primary bg-blue-primary",
            "hover:ring-blue-primary",
            commonHoverClasses
          );
        case "TVarBind":
        case "TVar":
          return classNames(
            "border-blue-quaternary ring-blue-quaternary bg-white-primary",
            "hover:ring-blue-quaternary",
            commonHoverClasses
          );
        case "TApp":
          return classNames(
            "border-blue-tertiary ring-blue-tertiary bg-blue-tertiary",
            "hover:ring-blue-tertiary",
            commonHoverClasses
          );
        case "TForall":
          return classNames(
            "border-blue-secondary ring-blue-secondary bg-blue-secondary",
            "hover:ring-blue-secondary",
            commonHoverClasses
          );
        case "TLet":
          return classNames(
            "border-blue-quaternary ring-blue-quaternary bg-blue-quaternary",
            "hover:ring-blue-quaternary",
            commonHoverClasses
          );

        // Note: most parts of patterns aren't selectable.
        // This node's background is transparent, so that we can draw
        // edges over it. Otherwise, we'd need to special-case the
        // z-index of edges when drawn inside a pattern.
        case "Pattern":
          return "border-yellow-primary ring-yellow-primary";

        case "PatternCon":
          return "border-green-primary ring-green-primary bg-white-primary";
        case "PrimPattern":
          return "border-green-primary ring-green-primary bg-white-primary";
        case "PatternWildcard":
          return "border-none bg-transparent";
      }
    })()
  );

export const flavorContentClasses = (
  flavor: NodeFlavorTextBody | NodeFlavorPrimBody | NodeFlavorNoBody
): string =>
  classNames(
    sortContentClasses(flavorSort(flavor)),
    (() => {
      switch (flavor) {
        case "Hole":
          return "font-code italic text-red-tertiary";
        case "EmptyHole":
          return "font-code italic text-red-tertiary";
        case "Ann":
          return "text-white-primary";
        case "App":
          return "text-white-primary";
        case "APP":
          return "text-white-primary";
        case "Con":
          return "text-blue-primary";
        case "KHole":
          return "font-code italic text-grey-tertiary";
        case "KType":
          return "text-white-primary";
        case "KFun":
          return "text-white-primary";
        case "Lam":
          return "text-white-primary";
        case "LAM":
          return "text-white-primary";
        case "GlobalVar":
          return "text-blue-primary";
        case "VarBind":
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
          return "font-code italic text-red-primary";
        case "THole":
          return "font-code italic text-red-primary";
        case "TCon":
          return "text-blue-primary";
        case "TFun":
          return "text-white-primary";
        case "TVarBind":
        case "TVar":
          return "text-blue-primary";
        case "TApp":
          return "text-white-primary";
        case "TForall":
          return "text-white-primary";
        case "TLet":
          return "text-white-primary";
        case "PatternCon":
          return "text-blue-primary";
        case "PrimPattern":
          return "text-blue-primary";
        case "PatternWildcard":
          // We use `scale-150` here because the text is an emoji which doesn't
          // respond to Tailwind's font size classes. The `text-grey-secondary` is a
          // backup in case the emoji doesn't render on a particular client.
          return "text-grey-secondary scale-150";
      }
    })()
  );

export const flavorLabelClasses = (flavor: NodeFlavor): string =>
  classNames(
    sortLabelClasses(flavorSort(flavor)),
    (() => {
      switch (flavor) {
        case "Hole":
          return "italic font-code bg-red-tertiary border-red-tertiary text-white-primary";
        case "EmptyHole":
          return "italic font-code bg-red-tertiary border-red-tertiary text-white-primary";
        case "Ann":
          return "font-code bg-black-primary border-black-primary text-white-primary";
        case "App":
          return "font-code bg-blue-tertiary border-blue-tertiary text-white-primary";
        case "APP":
          return "font-code bg-blue-tertiary border-blue-tertiary text-white-primary";
        case "Con":
          return "bg-green-primary border-green-primary text-white-primary";
        case "Lam":
          return "font-code bg-blue-primary border-blue-primary text-white-primary";
        case "LAM":
          return "font-code bg-blue-secondary border-blue-secondary text-white-primary";
        case "GlobalVar":
          return "bg-blue-quaternary border-blue-quaternary text-white-primary";
        case "KHole":
          return "italic font-code bg-grey-tertiary border-grey-tertiary text-white-primary";
        case "KType":
          return "font-code bg-grey-tertiary bg-grey-tertiary text-white-primary";
        case "KFun":
          return "font-code bg-grey-tertiary bg-grey-tertiary text-white-primary";
        case "VarBind":
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
          return "bg-green-primary border-green-primary text-white-primary";
        case "TEmptyHole":
          return "italic font-code bg-red-tertiary border-red-tertiary text-white-primary";
        case "THole":
          return "italic font-code bg-red-tertiary border-red-tertiary text-white-primary";
        case "TCon":
          return "bg-green-primary border-green-primary text-white-primary";
        case "TFun":
          return "font-code bg-blue-primary border-blue-primary text-white-primary";
        case "TVarBind":
        case "TVar":
          return "bg-blue-quaternary border-blue-quaternary text-white-primary";
        case "TApp":
          return "font-code bg-blue-tertiary border-blue-tertiary text-white-primary";
        case "TForall":
          return "font-code bg-blue-secondary border-blue-secondary text-white-primary";
        case "TLet":
          return "font-code bg-blue-quaternary border-blue-quaternary text-white-primary";
        case "Pattern":
          return "";
        case "PatternCon":
          return "bg-green-primary border-green-primary text-white-primary";
        case "PrimPattern":
          return "bg-green-primary border-green-primary text-white-primary";
        case "PatternWildcard":
          return "hidden";
      }
    })()
  );

export const flavorEdgeClasses = (flavor: NodeFlavor): string => {
  switch (flavor) {
    case "Hole":
      return "stroke-red-tertiary";
    case "EmptyHole":
      return "stroke-red-tertiary";
    case "Ann":
      return "stroke-black-primary";
    case "App":
      return "stroke-blue-tertiary";
    case "APP":
      return "stroke-blue-tertiary";
    case "Con":
      return "stroke-green-primary";
    case "KHole":
      return "stroke-grey-tertiary";
    case "KType":
      return "stroke-grey-tertiary";
    case "KFun":
      return "stroke-grey-tertiary";
    case "Lam":
      return "stroke-blue-primary";
    case "LAM":
      return "stroke-blue-secondary";
    case "GlobalVar":
      return "stroke-blue-quaternary";
    case "LocalVar":
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
      return "stroke-green-primary";
    case "TEmptyHole":
      return "stroke-red-tertiary";
    case "THole":
      return "stroke-red-tertiary";
    case "TCon":
      return "stroke-green-primary";
    case "TFun":
      return "stroke-blue-primary";
    case "TVar":
      return "stroke-blue-quaternary";
    case "TApp":
      return "stroke-blue-tertiary";
    case "TForall":
      return "stroke-blue-secondary";
    case "TLet":
      return "stroke-blue-quaternary";
    case "Pattern":
      return "stroke-yellow-primary";
    case "PatternCon":
      return "stroke-green-primary";
    case "PrimPattern":
      return "stroke-green-primary";
    case "PatternWildcard":
      return "stroke-grey-secondary";
    case "VarBind":
      return "stroke-blue-quaternary";
    case "TVarBind":
      return "stroke-blue-quaternary";
  }
};

// if these are going to have an `| undefined`, that only really makes sense if there's a `Level` input
// actually, idk, some stuff like `let` really don't need labels

// only used in beginner mode
export const flavorLabelBeginnerModeSyntax = (
  flavor: NodeFlavorNoBody
): Label | undefined => {
  const basicLabel = (contents: string): Label => ({
    contents,
    position: ["corner", "right"],
  });
  switch (flavor) {
    case "Hole":
      return basicLabel("misfit");
    case "EmptyHole":
      return basicLabel("hole");
    case "Ann":
      return basicLabel("type annotation");
    case "App":
      return basicLabel("apply");
    case "APP":
      return basicLabel("apply type");
    case "Lam":
      return basicLabel("lambda");
    case "LAM":
      return basicLabel("type lambda");
    case "Let":
      return undefined;
    case "LetType":
      return undefined;
    case "Letrec":
      return basicLabel("recursive let");
    case "Case":
      return basicLabel("match");
    case "CaseWith":
      return basicLabel("with");
    case "TEmptyHole":
      return basicLabel("type hole");
    case "THole":
      return basicLabel("misfit");
    case "TFun":
      return basicLabel("function type");
    case "TApp":
      return basicLabel("apply type");
    case "TForall":
      return basicLabel("forall");
    case "TLet":
      return basicLabel("type let");
    case "PatternWildcard":
      return basicLabel("🤷🏽‍♀️");
    case "KType":
      return basicLabel("type");
    case "KHole":
      return basicLabel("kind hole");
    case "KFun":
      return basicLabel("type constructor");
  }
};

export const flavorLabelTextNode = (
  flavor: NodeFlavorTextBody | NodeFlavorPrimBody
): Label | undefined => {
  const basicLabel = (contents: string): Label => ({
    contents,
    position: ["corner", "right"],
  });
  switch (flavor) {
    case "Con":
      return basicLabel("V");
    case "GlobalVar":
    case "LocalVar":
      return basicLabel("Var");
    case "PrimCon":
      return basicLabel("V");
    case "TCon":
      return basicLabel("T");
    case "TVar":
      return basicLabel("Var");
    case "PatternCon":
      return basicLabel("V");
    case "PrimPattern":
      return basicLabel("V");
    case "VarBind":
      return basicLabel("bind");
    case "TVarBind":
      return basicLabel("type bind");
  }
};

export const flavorLabel = (flavor: NodeFlavor): Label | undefined => {
  const contents = flavorLabelOld(flavor);
  return { contents, position: ["corner", "right"] };
};
export const flavorLabelOld = (flavor: NodeFlavor): string => {
  switch (flavor) {
    case "Hole":
      return "misfit";
    case "EmptyHole":
      return "hole";
    case "Ann":
      return "type annotation";
    case "App":
      return "apply";
    case "APP":
      return "apply type";
    case "Con":
      return "V";
    case "Lam":
      return "lambda";
    case "LAM":
      return "type lambda";
    case "GlobalVar":
      return "Var";
    case "LocalVar":
      return "Var";
    case "Let":
      return "let";
    case "LetType":
      return "let type";
    case "Letrec":
      return "recursive let";
    case "Case":
      return "match";
    case "CaseWith":
      return "with";
    case "PrimCon":
      return "V";
    case "TEmptyHole":
      return "type hole";
    case "THole":
      return "misfit";
    case "TCon":
      return "T";
    case "TFun":
      return "function type";
    case "TVar":
      return "Var";
    case "TApp":
      return "apply type";
    case "TForall":
      return "forall";
    case "TLet":
      return "type let";
    case "Pattern":
      return "";
    case "PatternCon":
      return "V";
    case "PrimPattern":
      return "V";
    case "PatternWildcard":
      return "🤷🏽‍♀️";
    case "KType":
      return "type";
    case "KHole":
      return "kind hole";
    case "KFun":
      return "type constructor";
    case "VarBind":
      return "bind";
    case "TVarBind":
      return "type bind";
  }
};

/** This is a slightly shaky concept, but essentially it comes down to whether labels can be omitted
 * without destroying the readability of the program.
 * In other words, would we show this flavor's label in text mode?
 */
export const flavorIsSyntax = (flavor: NodeFlavorTextBody): boolean => {
  switch (flavor) {
    case "Con":
    case "GlobalVar":
    case "LocalVar":
    case "TCon":
    case "TVar":
    case "PatternCon":
    case "VarBind":
    case "TVarBind":
      return false;
  }
};

export const syntaxNodeContents = (flavor: NodeFlavorNoBody): string => {
  switch (flavor) {
    case "Hole":
      return "⚠️";
    case "EmptyHole":
      return "?";
    case "Ann":
      return ":";
    case "App":
      return "←";
    case "APP":
      return "←";
    case "Lam":
      return "λ";
    case "LAM":
      return "Λ";
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
    case "TEmptyHole":
      return "?";
    case "THole":
      return "⚠️";
    case "TFun":
      return "→";
    case "TApp":
      return "←";
    case "TForall":
      return "∀";
    case "TLet":
      return "let";
    case "PatternWildcard":
      return "🤷🏽‍♀️";
    case "KType":
      return "✱";
    case "KHole":
      return "?";
    case "KFun":
      return "➜";
  }
};

export const boxFlavorBackground = (flavor: NodeFlavorBoxBody): string => {
  switch (flavor) {
    case "Pattern":
      return "bg-yellow-primary";
  }
};

/** What sort of node does this flavor correspond to?
 * Note that the backend could in principle tell us this independently of flavors,
 * since it comes down to whether the node ultimately comes from an `Expr`, `Type` or `Kind`.
 */
export const flavorSort = (flavor: NodeFlavor): "term" | "type" | "kind" => {
  switch (flavor) {
    case "Con":
    case "Lam":
    case "LAM":
    case "Let":
    case "Letrec":
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
    case "PatternWildcard":
    case "PrimPattern":
    case "VarBind":
      return "term";
    case "TCon":
    case "TVar":
    case "TForall":
    case "TLet":
    case "TEmptyHole":
    case "THole":
    case "TFun":
    case "TApp":
    case "TVarBind":
      return "type";
    case "KFun":
    case "KHole":
    case "KType":
      return "kind";
  }
};

export const sortClasses = (s: "term" | "type" | "kind"): string => {
  switch (s) {
    case "term":
      return classNames("rounded-3xl");
    case "type":
      return "";
    case "kind":
      return "rotate-45";
  }
};

export const sortLabelClasses = (s: "term" | "type" | "kind"): string => {
  switch (s) {
    case "term":
      return "rounded-3xl";
    case "type":
      return "";
    case "kind":
      return "";
  }
};

export const sortContentClasses = (s: "term" | "type" | "kind"): string => {
  switch (s) {
    case "term":
      return "";
    case "type":
      return "";
    case "kind":
      // This keeps the content fixed once the whole node is rotated. See `sortClasses`.
      return "-rotate-45";
  }
};
