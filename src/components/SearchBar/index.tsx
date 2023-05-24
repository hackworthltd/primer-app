import "@/index.css";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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

  /**
   * Called when the search bar form is submitted.
   */
  onSubmit: (searchTerm: string) => void;
}

// Note that this is hardly even a schema: it's a string, and we trim
// it. Preferably, we would give the caller a way to provide their own.
const schema = z.object({
  searchTerm: z.string().trim(),
});

type FormData = z.infer<typeof schema>;

export const SearchBar = (p: SearchBarProps): JSX.Element => {
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const onSubmit: SubmitHandler<FormData> = (data: FormData) => {
    p.onSubmit(data.searchTerm);
  };

  return (
    <div className="w-full">
      <label htmlFor="search" className="sr-only">
        {p.ariaLabel}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon
            className="h-5 w-5 text-grey-secondary"
            aria-hidden="true"
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            id="search"
            className="block w-full rounded-md border border-grey-secondary bg-white-primary py-2 pl-10 pr-3 text-sm placeholder:text-grey-secondary focus:border-blue-primary focus:text-grey-secondary focus:outline-none focus:ring-1 focus:ring-blue-primary focus:placeholder:text-grey-secondary sm:text-sm"
            placeholder={p.placeholder}
            type="search"
            {...register("searchTerm")}
          />
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
