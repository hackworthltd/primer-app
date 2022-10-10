import type { MouseEventHandler } from "react";
import classNames from "classnames";

import { UIButton } from "@/components";

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

const summaryClasses = (totalItems: number) =>
  classNames({
    hidden: totalItems === 0,
    "text-sm": true,
  });

export const SimplePaginationBar = (
  p: SimplePaginationBarProps
): JSX.Element => (
  <nav className="py-3" aria-label="Pagination">
    <div className="flex flex-1 items-center justify-between sm:justify-end">
      <div className="hidden p-2 sm:block">
        <p className={summaryClasses(p.totalItems)}>
          Showing <span className="font-medium">{p.startIndex}</span> to{" "}
          <span className="font-medium">{p.startIndex + p.numItems - 1}</span>{" "}
          of <span className="font-medium">{p.totalItems}</span>{" "}
          {p.itemNamePlural}
        </p>
      </div>
      <div className="inline-flex p-2">
        <UIButton
          onClick={p.onClickPreviousPage}
          size="responsive"
          appearance="plain"
          text="Previous"
          hidden={!p.onClickPreviousPage}
        />
      </div>
      <div className="inline-flex py-2 pl-2">
        <UIButton
          onClick={p.onClickNextPage}
          size="responsive"
          appearance="plain"
          text="Next"
          hidden={!p.onClickNextPage}
        />
      </div>
    </div>
  </nav>
);
