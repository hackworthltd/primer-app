import { Fragment, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { FaceFrownIcon, GlobeAmericasIcon } from "@heroicons/react/24/outline";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import classNames from "classnames";

import "@/index.css";

export type Prog = {
  types: string[];
  defs: string[];
  importedTypes: string[];
  importedDefs: string[];
};

export type OnClick = (name: string) => void;

export interface CommandPaletteProps {
  open: boolean;
  onCancel: () => void;
  onClose: () => void;
  onClickDef: OnClick;
  onClickTypeDef: OnClick;
  prog: Prog;
}

type ComboboxItem = { name: string; callback: OnClick };

const filterDefs = (defs: string[], query: string): readonly string[] => {
  return defs.filter((def) => {
    return def.toLowerCase().includes(query.toLowerCase());
  });
};

export const CommandPalette = (p: CommandPaletteProps): JSX.Element => {
  const [query, setQuery] = useState("");

  const filteredDefs: ComboboxItem[] = (
    query === "" ? p.prog.defs : filterDefs(p.prog.defs, query)
  ).map((def) => ({
    name: def,
    callback: p.onClickDef,
  }));
  const filteredTypes: ComboboxItem[] = (
    query === "" ? p.prog.types : filterDefs(p.prog.types, query)
  ).map((def) => ({
    name: def,
    callback: p.onClickTypeDef,
  }));

  return (
    <Transition.Root
      show={p.open}
      as={Fragment}
      afterLeave={() => setQuery("")}
      appear
    >
      <Dialog as="div" className="relative z-10" onClose={p.onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-grey-secondary/25 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-xl overflow-hidden rounded-xl bg-white-primary shadow-2xl ring-1 ring-blue-primary/5 transition-all">
              <Combobox
                onChange={(item: ComboboxItem) => item.callback(item.name)}
              >
                <div className="relative">
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-grey-secondary"
                    aria-hidden="true"
                  />
                  <Combobox.Input
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 font-code text-blue-primary placeholder:font-sans placeholder:text-grey-secondary focus:ring-0 sm:text-sm"
                    placeholder="Search types & definitions…"
                    onChange={(event) => setQuery(event.target.value)}
                    displayValue={(item: ComboboxItem) => item.name}
                  />
                </div>

                {(filteredDefs.length > 0 || filteredTypes.length > 0) && (
                  <Combobox.Options
                    static
                    className="max-h-80 scroll-pb-2 scroll-pt-11 space-y-2 overflow-y-auto pb-2"
                  >
                    {() => (
                      <div>
                        <li key="types">
                          <h2 className="bg-blue-primary px-4 py-2.5 text-sm font-medium text-white-primary">
                            Types
                          </h2>
                          <ul className="mt-2 font-code text-blue-primary">
                            {filteredTypes.map((item) => (
                              <Combobox.Option
                                key={`type-${item.name}`}
                                value={item}
                                className={({ active }) =>
                                  classNames(
                                    "cursor-default select-none px-4 py-2",
                                    active &&
                                      "bg-blue-secondary text-white-primary"
                                  )
                                }
                              >
                                {item.name}
                              </Combobox.Option>
                            ))}
                          </ul>
                        </li>
                        <li key="defs">
                          <h2 className="mt-2 bg-blue-primary px-4 py-2.5 text-sm font-medium text-white-primary">
                            Definitions
                          </h2>
                          <ul className="mt-2 font-code text-blue-primary">
                            {filteredDefs.map((item) => (
                              <Combobox.Option
                                key={`def-${item.name}`}
                                value={item}
                                className={({ active }) =>
                                  classNames(
                                    "cursor-default select-none px-4 py-2",
                                    active &&
                                      "bg-blue-secondary text-white-primary"
                                  )
                                }
                              >
                                {item.name}
                              </Combobox.Option>
                            ))}
                          </ul>
                        </li>
                      </div>
                    )}
                  </Combobox.Options>
                )}

                {query !== "" &&
                  filteredDefs.length === 0 &&
                  filteredTypes.length === 0 && (
                    <div className="border-t border-grey-quaternary px-6 py-14 text-center text-sm sm:px-14">
                      <FaceFrownIcon
                        className="mx-auto h-6 w-6 text-blue-primary"
                        aria-hidden="true"
                      />
                      <p className="mt-4 text-lg font-semibold leading-6 text-blue-secondary">
                        No results found
                      </p>
                      <p className="mt-2 block text-sm leading-6 text-blue-primary">
                        We couldn’t find any types or definitions by that name.
                        Please try a different name, or define a new type or
                        definition.
                      </p>
                    </div>
                  )}

                {query === "" &&
                  filteredDefs.length === 0 &&
                  filteredTypes.length === 0 && (
                    <div className="border-t border-grey-quaternary px-6 py-14 text-center text-sm sm:px-14">
                      <GlobeAmericasIcon
                        className="mx-auto h-6 w-6 text-blue-primary"
                        aria-hidden="true"
                      />
                      <p className="mt-4 text-lg font-semibold leading-6 text-blue-secondary">
                        No types or definitions found
                      </p>
                      <p className="mt-2 block text-sm leading-6 text-blue-primary">
                        You haven’t defined any types or definitions in this
                        program yet. Click the &quot;Add a new definition&quot;
                        or &quot;Add a new type&quot; button to get started.
                      </p>
                    </div>
                  )}
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CommandPalette;
