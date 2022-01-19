import type { MouseEventHandler } from "react";

import { UIButton } from "@/UIButton/UIButton";

import "@/index.css";

export interface SimplePaginationBarProps {
  /**
   * The name given to items (plural); e.g., "projects".
   *
   * @type {String}
   */
  itemNamePlural: string;

  /**
   * The 1-based index of the first item shown on this page.
   *
   * @type {number}
   */
  startIndex: number;

  /**
   * The number of items displayed on this page.
   *
   * @type {number}
   */
  numItems: number;

  /**
   * The total number of items.
   *
   * @type {number}
   */
  totalItems: number;

  /**
   * The event handler for the "next page" button, if there is one.
   *
   * @type {MouseEventHandler<unknown> | undefined}
   */
  onClickNextPage: MouseEventHandler<unknown> | undefined;

  /**
   * The event handler for the "previous page" button, if there is one.
   *
   * @type {MouseEventHandler<unknown> | undefined}
   */
  onClickPreviousPage: MouseEventHandler<unknown> | undefined;
}

export const SimplePaginationBar = (
  p: SimplePaginationBarProps
): JSX.Element => (
  <nav
    className="px-4 py-3 flex items-center justify-between border-t sm:px-6"
    aria-label="Pagination"
  >
    <div className="hidden sm:block">
      <p className="text-sm">
        Showing <span className="font-medium">{p.startIndex}</span> to{" "}
        <span className="font-medium">{p.startIndex + p.numItems - 1}</span> of{" "}
        <span className="font-medium">{p.totalItems}</span> {p.itemNamePlural}
      </p>
    </div>
    <div className="flex-1 flex justify-between sm:justify-end">
      <div className="inline-flex px-2 py-2">
        <UIButton
          onClick={p.onClickPreviousPage}
          size="responsive"
          appearance="secondary"
          text="Previous"
        />
      </div>
      <div className="inline-flex px-2 py-2">
        <UIButton
          onClick={p.onClickNextPage}
          size="responsive"
          appearance="secondary"
          text="Next"
        />
      </div>
    </div>
  </nav>
);
