import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";

export type OptionType = "code" | "prose";

export type SelectMenuProps = {
  /*
   * The menu's label.
   */
  label: string;

  /*
   * The currently selected option. This option should be in the `options`
   * array.
   */
  selected: string;

  /*
   * The options to display in the menu.
   *
   * Note that it's assumed that the options are unique.
   */
  options: string[];

  /*
   * Are the options considered to be code, or prose?
   */
  optionType: OptionType;

  /*
   * This function is called when an option is selected that's different than
   * the current selection.
   */
  onChange: (value: string) => void;
};

// Note: the listbox options are currently limited to `max-h-40`, which is
// equivalent to 4 menu options, in order to fit in the `FloatingToolbar`
// bounds. We should fix this once we figure out the proper CSS incanations.
export const SelectMenu = (p: SelectMenuProps) => {
  return (
    <Listbox value={p.selected} onChange={p.onChange}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium leading-6 text-blue-primary">
            {p.label}
          </Listbox.Label>
          <div className="relative mt-2">
            <Listbox.Button
              title={p.selected}
              className="relative w-full cursor-default rounded-md bg-white-primary py-1.5 pl-3 pr-10 text-left text-blue-primary shadow-sm ring-1 ring-inset ring-grey-primary focus:outline-none focus:ring-2 focus:ring-blue-secondary sm:text-sm sm:leading-6"
            >
              <span
                className={classNames(
                  "block truncate",
                  p.optionType === "code" ? "font-code" : ""
                )}
              >
                {p.selected}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-grey-secondary"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md bg-white-primary py-1 text-base shadow-lg ring-1 ring-blue-primary/5 focus:outline-none sm:text-sm">
                {p.options.map((option) => (
                  <Listbox.Option
                    key={option}
                    className={({ active }) =>
                      classNames(
                        active
                          ? "bg-blue-primary text-white-primary"
                          : "text-blue-primary",
                        "relative cursor-default select-none py-2 pl-3 pr-9"
                      )
                    }
                    value={option}
                    title={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            p.optionType === "code" ? "font-code" : "",
                            "block truncate"
                          )}
                        >
                          {option}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active
                                ? "text-white-primary"
                                : "text-blue-primary",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};

export default SelectMenu;
