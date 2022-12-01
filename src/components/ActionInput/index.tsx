import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useState } from "react";
import { buttonClassesBase } from "../ActionButton";

export type ActionInputProps = {
  onSubmit: (option: string) => void;
};

export const ActionInput = (p: ActionInputProps): JSX.Element => {
  const [input, setInput] = useState<string>("");
  return (
    <div
      className={classNames(
        buttonClassesBase, // we can't reuse `buttonClassesPrimary` because we don't want white text on hover
        "border-grey-primary text-blue-primary bg-white-primary hover:bg-blue-primary focus:ring-blue-primary",
        "p-3 w-full",
        "relative" // this is so that we can place the submit button arrow
      )}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          p.onSubmit(input);
        }}
        className="flex w-full items-center"
      >
        <input
          type="text"
          className="w-full rounded border-grey-primary bg-grey-primary shadow-inner"
          onInput={(e) => setInput(e.currentTarget.value)}
        />
        <button
          className="absolute right-5"
          type="button"
          onClick={(_) => p.onSubmit(input)}
        >
          <ArrowUturnLeftIcon className="w-6 scale-y-[-1]"></ArrowUturnLeftIcon>
        </button>
      </form>
    </div>
  );
};
