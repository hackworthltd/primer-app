import "@/index.css";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";

import { useState } from "react";
import { buttonClassesPrimary, buttonClassesSecondary } from "../ActionButton";

const headerStyle = "pb-3 text-base lg:text-lg font-bold text-blue-primary";
const subHeaderStyle = "mb-1 text-sm lg:text-base font-bold text-blue-primary";

export interface CreateTypeDefModalProps {
  onClose: () => void;
  onSubmit: (names: { typeName: string; ctorNames: string[] }) => void;
}

export const CreateTypeDefModal = ({
  onClose,
  onSubmit,
}: CreateTypeDefModalProps): JSX.Element => {
  const [key, setKey] = useState(0);
  type Names = {
    tyName: { name: string; valid: boolean };
    ctors: { key: number; name: string; valid: boolean }[];
  };
  const [{ tyName, ctors }, setNames] = useState<Names>({
    tyName: { name: "", valid: false },
    ctors: [],
  });
  // This method of checking validity is not optimised. However, we expect all lists to be fairly small
  // so it should not be a bottleneck
  const isValid = (names: Names, i: "tyName" | number, n: string) => {
    // is non-empty
    if (n.length == 0) {
      return false;
    }
    // and unique
    if (i != "tyName" && n === names.tyName.name) {
      return false;
    }
    return names.ctors.every(({ name }, idx) => idx === i || name != n);
  };
  const updateValidity = () => {
    setNames((ns) => ({
      tyName: { ...ns.tyName, valid: isValid(ns, "tyName", ns.tyName.name) },
      ctors: ns.ctors.map(({ key, name }, idx) => ({
        key,
        name,
        valid: isValid(ns, idx, name),
      })),
    }));
  };
  const setTyName = (name: string) => {
    setNames((ns) => ({ ...ns, tyName: { ...ns.tyName, name } }));
    updateValidity();
  };
  const addCtor = () => {
    setKey(key + 1);
    setNames((ns) => ({
      ...ns,
      ctors: [...ns.ctors, { key, name: "", valid: false }],
    }));
  };
  const setCtor = (key: number, idx: number, name: string) => {
    setNames((ns) => ({
      ...ns,
      ctors: [
        ...ns.ctors.slice(0, idx),
        { key, name, valid: true },
        ...ns.ctors.slice(idx + 1),
      ],
    }));
    updateValidity();
  };
  return (
    <div>
      <div>
        <span className={classNames(headerStyle)}>
          Define an enumeration type
        </span>
      </div>
      <div>
        <span className={classNames(subHeaderStyle, "pr-5")}>Type Name</span>
        <input
          type="text"
          value={tyName.name}
          onChange={(c) => setTyName(c.target.value)}
          className={classNames(
            "w-96 rounded border-grey-primary bg-grey-primary shadow-inner",
            tyName.valid ? "border-green-primary" : "border-red-primary"
          )}
          minLength={1}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <div className={classNames(subHeaderStyle, "pr-5", "flex gap-2")}>
          Constructors
          <button onClick={addCtor}>
            <PlusCircleIcon className="w-5" />
          </button>
        </div>
        {ctors.map(({ key, name, valid }, idx) => (
          <div className="flex gap-1" key={key}>
            <input
              type="text"
              value={name}
              onChange={(c) => setCtor(key, idx, c.target.value)}
              className={classNames(
                "w-96 rounded border-grey-primary bg-grey-primary shadow-inner",
                valid ? "border-green-primary" : "border-red-primary"
              )}
              minLength={1}
              required
            />
            <button
              onClick={() =>
                setNames(({ tyName, ctors }) => ({
                  tyName,
                  ctors: ctors.slice(0, idx).concat(ctors.slice(idx + 1)),
                }))
              }
            >
              <MinusCircleIcon className="w-5" />
            </button>
          </div>
        ))}
      </div>
      <button
        className={classNames(
          buttonClassesPrimary,
          "w-full justify-center p-3 pt-2 mt-8"
        )}
        onClick={() =>
          onSubmit({
            typeName: tyName.name,
            ctorNames: ctors.map((c) => c.name),
          })
        }
      >
        Submit
      </button>
      <button
        className={classNames(
          buttonClassesSecondary,
          "w-full justify-center p-3 pt-2 mt-8"
        )}
        onClick={onClose}
      >
        Cancel
      </button>
    </div>
  );
};

export default CreateTypeDefModal;
