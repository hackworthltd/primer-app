import "@/index.css";

import { Fragment } from "react";
import classNames from "classnames";
import { Menu, Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import type { Account } from "@hackworthltd/primer-types";
import { Avatar } from "@/Avatar/Avatar";
import { UIButton } from "@/UIButton/UIButton";
import { PrimerBranding } from "@/PrimerBranding/PrimerBranding";
import { SearchBar } from "@/SearchBar/SearchBar";

export interface SessionsNavBarProps {
  /**
   * The account whose sessions will be displayed.
   *
   * @type {Account}
   */
  account: Account;
}

const accountNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

export const SessionsNavBar = (p: SessionsNavBarProps): JSX.Element => (
  <>
    {/* When the mobile menu is open, add `overflow-y-auto` to prevent double scrollbars. */}
    <Popover
      as="header"
      className={({ open }) =>
        classNames(
          open ? "fixed inset-0 z-40 overflow-y-auto" : "",
          "bg-white-primary shadow-sm lg:static lg:overflow-y-visible"
        )
      }
    >
      {({ open }) => (
        <>
          <div className="px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
            <div className="flex xl:grid relative xl:grid-cols-12 lg:gap-8 justify-between">
              <div className="flex">
                <PrimerBranding size="responsive" />
              </div>
              <div className="flex-1 xl:col-span-6 md:px-8 lg:px-0 min-w-0">
                <div className="flex items-center py-4 px-6 xl:px-0 md:mx-auto lg:mx-0 md:max-w-3xl lg:max-w-none">
                  <SearchBar
                    ariaLabel="Search programs"
                    placeholder="Program name"
                  />
                </div>
              </div>
              <div className="flex lg:hidden md:absolute md:inset-y-0 md:right-0 items-center">
                {/* Mobile menu button */}
                <Popover.Button className="inline-flex justify-center items-center p-2 -mx-2 text-blue-primary hover:text-blue-secondary hover:bg-grey-primary rounded-md focus:ring-2 focus:ring-inset focus:ring-blue-primary focus:outline-none">
                  <span className="sr-only">Open menu</span>
                  {open ? (
                    <XIcon className="block w-6 h-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block w-6 h-6" aria-hidden="true" />
                  )}
                </Popover.Button>
              </div>
              <div className="hidden lg:flex xl:col-span-4 lg:justify-end lg:items-center">
                {/* Profile dropdown */}
                <Menu as="div" className="relative flex-shrink-0 ml-5">
                  <div>
                    <Menu.Button className="flex bg-white-primary rounded-full focus:ring-2 focus:ring-blue-primary focus:ring-offset-2 focus:outline-none">
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
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 py-1 mt-2 w-48 text-blue-primary bg-white-primary rounded-md ring-1 ring-blue-primary ring-opacity-5 shadow-lg origin-top-right focus:outline-none">
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
                <div className="inline-flex items-center py-2 px-4 ml-4">
                  <UIButton
                    size="responsive"
                    appearance="primary"
                    text="New program"
                  />
                </div>
              </div>
            </div>
          </div>

          <Popover.Panel as="nav" className="lg:hidden" aria-label="Global">
            <div className="pt-4 pb-3 border-t border-grey-primary">
              <div className="flex items-center px-4 sm:px-6 mx-auto max-w-3xl">
                <div className="flex-shrink-0">
                  <Avatar
                    id={p.account.email}
                    style={p.account.avatarStyle}
                    imgSrc={p.account.imageUrl}
                    decoration="plain"
                    size="responsive"
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-blue-primary">
                    {p.account.name}
                  </div>
                  <div className="text-sm font-medium text-blue-primary">
                    {p.account.email}
                  </div>
                </div>
              </div>
              <div className="px-2 sm:px-4 mx-auto mt-3 space-y-1 max-w-3xl">
                {accountNavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block py-2 px-3 text-base font-medium text-blue-primary hover:text-white-primary hover:bg-blue-primary rounded-md"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </Popover.Panel>
        </>
      )}
    </Popover>
  </>
);
