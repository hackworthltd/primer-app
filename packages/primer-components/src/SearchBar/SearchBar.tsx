import "@/index.css";

import { SearchIcon } from "@heroicons/react/solid";

export interface SearchBarProps {
  /**
   * The search bar label for ARIA screen readers. This should be used
   * as a short description of what will be searched.
   *
   * Note that this label is only visible to screen readers.
   * (Placeholders are not. See
   * https://www.w3.org/WAI/tutorials/forms/instructions/#placeholder-text)
   *
   * @type {string}
   */
  ariaLabel: string;

  /**
   * The search bar placeholder text. Note that this is different than
   * the label, for two reasons: a) it is not visible to screen
   * readers, anb b) it should be used as an example of what to search
   * for, not what will be searched. The component will provide other
   * visual indications that this is a search field, so it need not be
   * mentioned here.
   *
   * @type {string}
   */
  placeholder: string;
}

export const SearchBar = (p: SearchBarProps): JSX.Element => (
  <div className="w-full">
    <label htmlFor="search" className="sr-only">
      {p.ariaLabel}
    </label>
    <div className="relative">
      <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
        <SearchIcon
          className="w-5 h-5 text-grey-secondary"
          aria-hidden="true"
        />
      </div>
      <input
        id="search"
        name="search"
        className="block py-2 pr-3 pl-10 w-full text-sm sm:text-sm placeholder-grey-secondary focus:placeholder-grey-secondary focus:text-grey-secondary rounded-md border border-grey-secondary focus:border-blue-primary focus:ring-1 focus:ring-blue-primary focus:outline-none bg-white"
        placeholder={p.placeholder}
        type="search"
      />
    </div>
  </div>
);
