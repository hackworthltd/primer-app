import { BookOpenIcon } from "@heroicons/react/24/outline";

export interface DefsToolbarProps {
  onClickDefs: () => void;
}

const iconClasses = "stroke-[2] p-1";
const buttonClasses =
  "flex h-12 w-12 flex-col items-center rounded hover:text-white-primary text-blue-primary hover:bg-blue-primary";

export const DefsToolbar = (p: DefsToolbarProps): JSX.Element => {
  return (
    <div className="flex select-none flex-row items-center justify-center gap-2 rounded bg-grey-primary p-2 text-sm font-medium text-blue-primary shadow-sm">
      <button
        title="Defs definitions"
        type="button"
        onClick={p.onClickDefs}
        className={buttonClasses}
      >
        <BookOpenIcon className={iconClasses} />
        defs
      </button>
    </div>
  );
};

export default DefsToolbar;
