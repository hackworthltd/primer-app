import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { FreeInput } from "@/primer-api";
import classNames from "classnames";
import { useRef, InputHTMLAttributes, useState } from "react";
import { buttonClassesBase } from "../ActionButton";

export type ActionInputProps = {
  sort: Exclude<FreeInput, "FreeNone">;
  onSubmit: (option: string) => void;
};

export const ActionInput = (p: ActionInputProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState<string>("");
  const getAttrs = (): {
    errMsg: string;
    inputProps: InputHTMLAttributes<HTMLInputElement>;
  } => {
    switch (p.sort) {
      case "FreeVarName":
        return {
          errMsg: "Please enter a non-empty string",
          inputProps: { required: true },
        };
      case "FreeInt":
        return {
          errMsg: "Please enter a whole (positive or negative) number",
          inputProps: {
            // Note that we intentionally do not use type: "number"
            // We wish to avoid the special handling that browsers give that, such as
            // an up/down button, mouse scroll wheel can change the input number,
            // handling of exponential notation '1e2' and rounding of large numbers.
            // c.f. https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/
            inputMode: "numeric",
            pattern: "[-+]?[0-9]+",
            minLength: 1,
            required: true,
          },
        };
      case "FreeChar":
        return {
          errMsg: "Please enter a single (unicode) character",
          // the maxLength is something small that is still large enough to allow any unicode code point
          // the pattern will match unicode code points: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/pattern
          // Note that there are some things that a human may call a "character" which are represented by multiple code points!
          inputProps: {
            minLength: 1,
            maxLength: 5,
            pattern: "^.$",
            required: true,
          },
        };
    }
  };
  const { errMsg, inputProps } = getAttrs();
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
          ref={inputRef}
          type="text"
          className="w-full rounded border-grey-primary bg-grey-primary shadow-inner valid:border-green-primary invalid:border-red-primary"
          onInput={(e) => {
            setInput(e.currentTarget.value);
            e.currentTarget.setCustomValidity("");
            e.currentTarget.checkValidity() ||
              e.currentTarget.setCustomValidity(errMsg);
          }}
          {...inputProps}
        />
        <button
          className="absolute right-5"
          type="button"
          onClick={(_) => {
            inputRef?.current?.reportValidity() && p.onSubmit(input);
          }}
        >
          <ArrowUturnLeftIcon className="w-6 -scale-y-100"></ArrowUturnLeftIcon>
        </button>
      </form>
    </div>
  );
};
