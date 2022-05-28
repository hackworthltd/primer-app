import type { MouseEventHandler } from "react";
import { Fragment } from "react";
import classNames from "classnames";
import { Menu, Transition } from "@headlessui/react";
import type { Account } from "@hackworthltd/primer-types";
import { Avatar } from "@/Avatar/Avatar";
import { UIButton } from "@/UIButton/UIButton";
import { PrimerBranding } from "@/PrimerBranding/PrimerBranding";
import { SearchBar } from "@/SearchBar/SearchBar";

import "@/index.css";

export interface SessionsNavBarProps {
  /**
   * The account whose sessions will be displayed.
   *
   * @type {Account}
   */
  account: Account;

  /**
   * The "New program" button's on-click handler.
   *
   * @type {React.MouseEventHandler<unknown>}
   */
  onClickNewProgram: MouseEventHandler<unknown> | undefined;
}

const accountNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

export const SessionsNavBar = (p: SessionsNavBarProps): JSX.Element => (
  <>
    <div className="flex overflow-y-visible relative justify-between">
      <div className="flex py-6">
        <PrimerBranding size="responsive" />
      </div>
      <div className="flex-1 items-center p-6 min-w-0">
        <SearchBar ariaLabel="Search programs" placeholder="Program name" />
      </div>
      <div className="flex justify-end items-center">
        {/* Profile dropdown */}
        <Menu as="div" className="relative shrink-0">
          <div>
            <Menu.Button className="flex bg-white-primary rounded-full focus:outline-none focus:ring-2 focus:ring-blue-primary focus:ring-offset-2">
              <span className="sr-only">Open account menu</span>
              <Avatar
                id={p.account.email}
                style={p.account.avatarStyle}
                imgSrc={p.account.imageUrl}
                decoration="plain"
                size="responsive"
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 py-1 mt-2 w-48 text-blue-primary bg-white-primary rounded-md focus:outline-none ring-1 ring-blue-primary/5 shadow-lg origin-top-right">
              {accountNavigation.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <a
                      href={item.href}
                      className={classNames(
                        active ? "bg-white-primary" : "",
                        "block py-2 px-4 text-sm text-blue-primary hover:text-white-primary hover:bg-blue-secondary"
                      )}
                    >
                      {item.name}
                    </a>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
        <div className="inline-flex items-center py-2 pl-4">
          <UIButton
            size="responsive"
            appearance="primary"
            text="New program"
            onClick={p.onClickNewProgram}
          />
        </div>
      </div>
    </div>
  </>
);
