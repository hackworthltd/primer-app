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
  switch (flavor) {
    case "Hole":
      return classNames(
        "rounded-full border-red-tertiary ring-red-tertiary bg-white-primary",
        "hover:ring-red-tertiary",
        commonHoverClasses
      );
    case "EmptyHole":
      return classNames(
        "rounded-full border-red-tertiary ring-red-tertiary bg-white-primary",
        "hover:ring-red-tertiary",
        commonHoverClasses
      );
    case "Ann":
      return classNames(
        "rounded-md border-black-primary ring-black-primary bg-black-primary",
        "hover:ring-black-primary",
        commonHoverClasses
      );
    case "App":
      return classNames(
        "rounded-md border-blue-tertiary ring-blue-tertiary bg-blue-tertiary",
        "hover:ring-blue-tertiary",
        commonHoverClasses
      );
    case "APP":
      return classNames(
        "rounded-md border-yellow-secondary ring-yellow-secondary bg-yellow-secondary",
        "hover:ring-yellow-secondary",
        commonHoverClasses
      );
    case "Con":
      return classNames(
        "rounded-md border-green-primary ring-green-primary bg-white-primary",
        "hover:ring-green-primary",
        commonHoverClasses
      );
    case "KHole":
      return classNames(
        "border-red-tertiary ring-red-tertiary bg-white-primary",
        "hover:ring-red-tertiary",
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
        "rounded-md border-blue-primary ring-blue-primary bg-white-primary",
        "hover:ring-blue-primary",
        commonHoverClasses
      );
    case "LAM":
      return classNames(
        "rounded-md border-black-primary ring-black-primary bg-white-primary",
        "hover:ring-black-primary",
        commonHoverClasses
      );
    case "GlobalVar":
      return classNames(
        "rounded-md border-blue-quaternary ring-blue-quaternary bg-white-primary",
        "hover:ring-blue-quaternary",
        commonHoverClasses
      );
    case "LocalVar":
      return classNames(
        "rounded-md border-blue-quaternary ring-blue-quaternary bg-white-primary",
        "hover:ring-blue-quaternary",
        commonHoverClasses
      );
    case "Let":
      return classNames(
        "rounded-md border-blue-quaternary ring-blue-quaternary bg-blue-quaternary",
        "hover:ring-blue-quaternary",
        commonHoverClasses
      );
    case "LetType":
      return classNames(
        "rounded-md border-blue-quaternary ring-blue-quaternary bg-blue-quaternary",
        "hover:ring-blue-quaternary",
        commonHoverClasses
      );
    case "Letrec":
      return classNames(
        "rounded-md border-blue-quaternary ring-blue-quaternary bg-blue-quaternary",
        "hover:ring-blue-quaternary",
        commonHoverClasses
      );
    case "Case":
      return classNames(
        "rounded-md border-yellow-primary ring-yellow-primary bg-yellow-primary",
        "hover:ring-yellow-primary",
        commonHoverClasses
      );

    // Note: not selectable.
    case "CaseWith":
      return "rounded-md border-yellow-primary ring-yellow-primary bg-yellow-primary";

    case "PrimCon":
      return classNames(
        "rounded-md border-black-primary ring-black-primary bg-white-primary",
        "hover:ring-black-primary",
        commonHoverClasses
      );
    case "TEmptyHole":
      return classNames(
        "rounded-full border-red-primary ring-red-primary bg-white-primary",
        "hover:ring-red-primary",
        commonHoverClasses
      );
    case "THole":
      return classNames(
        "rounded-full border-red-primary ring-red-primary bg-white-primary",
        "hover:ring-red-primary",
        commonHoverClasses
      );
    case "TCon":
      return classNames(
        "rounded-md border-black-primary ring-black-primary bg-white-primary",
        "hover:ring-black-primary",
        commonHoverClasses
      );
    case "TFun":
      return classNames(
        "rounded-md border-black-primary ring-black-primary bg-black-primary",
        "hover:ring-black-primary",
        commonHoverClasses
      );
    case "TVar":
      return classNames(
        "rounded-md border-black-primary ring-black-primary bg-white-primary",
        "hover:ring-black-primary",
        commonHoverClasses
      );
    case "TApp":
      return classNames(
        "rounded-md border-black-primary ring-black-primary bg-black-primary",
        "hover:ring-black-primary",
        commonHoverClasses
      );
    case "TForall":
      return classNames(
        "rounded-md border-black-primary ring-black-primary bg-white-primary",
        "hover:ring-black-primary",
        commonHoverClasses
      );
    case "TLet":
      return classNames(
        "rounded-md border-black-primary ring-black-primary bg-black-primary",
        "hover:ring-black-primary",
        commonHoverClasses
      );

    // Note: most parts of patterns aren't selectable.

    // This node's background is transparent, so that we can draw
    // edges over it. Otherwise, we'd need to special-case the
    // z-index of edges when drawn inside a pattern.
    case "Pattern":
      return "rounded-md border-yellow-primary ring-yellow-primary";

    case "PatternCon":
      return "rounded-md border-green-primary ring-green-primary bg-white-primary";
    case "PrimPattern":
      return "border-black-primary ring-black-primary bg-white-primary";
    case "PatternWildcard":
      return "border-none bg-transparent";
    case "PatternBind":
      return classNames(
        "rounded-md border-blue-quaternary ring-blue-quaternary bg-white-primary",
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
      return "text-blue-primary";
    case "KType":
      return "text-white-primary";
    case "KFun":
      return "text-white-primary";
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
      return "font-code italic text-red-primary";
    case "THole":
      return "font-code italic text-red-primary";
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
    case "PrimPattern":
      return "text-blue-primary";
    case "PatternWildcard":
      // We use `scale-150` here because the text is an emoji which doesn't
      // respond to Tailwind's font size classes. The `text-grey-secondary` is a
      // backup in case the emoji doesn't render on a particular client.
      return "text-grey-secondary scale-150";
    case "PatternBind":
      return "text-blue-primary";
  }
};

export const flavorLabelClasses = (flavor: NodeFlavor): string => {
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
      return "font-code bg-yellow-secondary border-yellow-secondary text-white-primary";
    case "Con":
      return "bg-green-primary border-green-primary text-white-primary";
    case "Lam":
      return "font-code bg-blue-primary border-blue-primary text-white-primary";
    case "LAM":
      return "font-code bg-black-primary border-black-primary text-white-primary";
    case "GlobalVar":
      return "bg-blue-quaternary border-blue-quaternary text-white-primary";
    case "KHole":
      return "font-code bg-red-tertiary border-red-tertiary text-white-primary";
    case "KType":
      return "font-code bg-grey-tertiary bg-grey-tertiary text-white-primary";
    case "KFun":
      return "font-code bg-grey-tertiary bg-grey-tertiary text-white-primary";
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
      return "italic font-code bg-red-primary border-red-primary text-white-primary";
    case "THole":
      return "italic font-code bg-red-primary border-red-primary text-white-primary";
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
    case "PrimPattern":
      return "bg-black-primary border-black-primary text-white-primary";
    case "PatternWildcard":
      return "hidden";
    case "PatternBind":
      return "bg-blue-quaternary border-blue-quaternary text-white-primary";
  }
};

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
      return "stroke-yellow-secondary";
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
      return "stroke-black-primary";
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
      return "stroke-black-primary";
    case "TEmptyHole":
      return "stroke-red-primary";
    case "THole":
      return "stroke-red-primary";
    case "TCon":
      return "stroke-black-primary";
    case "TFun":
      return "stroke-black-primary";
    case "TVar":
      return "stroke-black-primary";
    case "TApp":
      return "stroke-black-primary";
    case "TForall":
      return "stroke-black-primary";
    case "TLet":
      return "stroke-black-primary";
    case "Pattern":
      return "stroke-yellow-primary";
    case "PatternCon":
      return "stroke-green-primary";
    case "PrimPattern":
      return "stroke-black-primary";
    case "PatternWildcard":
      return "stroke-black-primary";
    case "PatternBind":
      return "stroke-blue-quaternary";
  }
};

export const flavorLabel = (flavor: NodeFlavor): string => {
  switch (flavor) {
    case "Hole":
      return "⚠️";
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
      return "⚠️";
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
    case "PrimPattern":
      return "V";
    case "PatternWildcard":
      return "🤷🏽‍♀️";
    case "PatternBind":
      return "Var";
    case "KType":
      return "✱";
    case "KHole":
      return "?";
    case "KFun":
      return "➜";
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
    case "Hole":
      return "misfit";
    case "EmptyHole":
      return "hole";
    case "TEmptyHole":
      return "type hole";
    case "THole":
      return "misfit";
    case "PatternWildcard":
      return "🤷🏽‍♀️";
    case "KType":
      return "type";
    case "KHole":
      return "?";
    case "KFun":
      return "type constructor";
  }
};

export const boxFlavorBackground = (flavor: NodeFlavorBoxBody): string => {
  switch (flavor) {
    case "Pattern":
      return "bg-yellow-primary";
  }
};
