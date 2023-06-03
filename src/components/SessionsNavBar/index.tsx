import type { MouseEventHandler } from "react";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import type { Account } from "@/Types";
import { Avatar, UIButton, Branding, SearchBar } from "@/components";

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

  /**
   * The search bar's onChange handler.
   */
  onChangeSearch: (searchString: string) => void;

  /**
   * The search bar's onSubmit handler.
   */
  onSubmitSearch: (searchString: string) => void;
}

const accountNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

export const SessionsNavBar = (p: SessionsNavBarProps): JSX.Element => (
  <>
    <div className="relative flex justify-between overflow-y-visible">
      <div className="flex px-3 py-6">
        <Branding />
      </div>
      <div className="min-w-0 flex-1 items-center px-3 py-6">
        <SearchBar
          ariaLabel="Search programs"
          placeholder="Program name"
          onSubmit={p.onSubmitSearch}
          onChange={p.onChangeSearch}
        />
      </div>
      <div className="flex items-center justify-end pl-3">
        {/* Profile dropdown */}
        <Menu as="div" className="relative shrink-0">
          <div>
            <Menu.Button className="flex rounded-full ring-2 ring-grey-quaternary focus:outline-none focus:ring-2 focus:ring-blue-primary focus:ring-offset-2">
              <span className="sr-only">Open account menu</span>
              <Avatar
                id={p.account.id}
                style={p.account.avatarStyle}
                imgSrc={undefined}
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
            <Menu.Items className="absolute right-0 z-40 mt-2 w-48 origin-top-right rounded-md bg-white-primary py-1 text-blue-primary shadow-lg ring-1 ring-blue-primary/5 focus:outline-none">
              {accountNavigation.map((item) => (
                <Menu.Item key={item.name}>
                  <a
                    href={item.href}
                    className="ui-active:bg-white-primary block px-4 py-2 text-sm text-blue-primary hover:bg-blue-secondary hover:text-white-primary"
                  >
                    {item.name}
                  </a>
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

export default SessionsNavBar;
