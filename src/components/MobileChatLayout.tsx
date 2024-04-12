"use client";

import { FC, Fragment, ReactElement, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoMdClose as XMarkIcon } from "react-icons/io";
import Link from "next/link";
import { FaReact } from "react-icons/fa";
import Button from "./ui/Button";
import { FiMenu } from "react-icons/fi";
import SignOutButton from "./SignOutButton";
import Image from "next/image";
import SidebarChatList from "./ui/SidebarChatList";
import FriendRequestSidebarOptions from "./FriendRequestSidebarOptions";

interface SideBarOption {
  id: number;
  name: string;
  href: string;
  Icon: ReactElement;
}

interface MobileChatLayoutProps {
  friends: User[];
  session: User;
  unseenRequestsCount: number;
  sideBarOptions: SideBarOption[];
}

const MobileChatLayout: FC<MobileChatLayoutProps> = ({
  friends,
  session,
  unseenRequestsCount,
  sideBarOptions,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute top-0 flex w-full p-2  flex-row items-center justify-between">
      <div className="flex justify-between flex-row">
        <Link
          href="/dashboard"
          className="flex h-16 gap-4 shrink-0 items-center "
        >
          <FaReact className="h-10 w-auto text-blue-700 transition-all hover:scale-105  hover:text-blue-500 hover:rotate-45" />
          <span className="text-blue-700 font-semibold text-xl">Layton</span>
        </Link>
      </div>
      <div className="flex justify-center items-center">
        <Button
          className="bg-zinc-500 hover:bg-zinc-700"
          variant={"default"}
          onClick={() => setOpen(true)}
        >
          <FiMenu className="w-6 h-6" />
        </Button>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-500"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                        <button
                          type="button"
                          className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => setOpen(false)}
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          <Link
                            href="/dashboard"
                            className="flex h-16 gap-4 shrink-0 items-center "
                          >
                            <span className="text-blue-700 font-semibold text-2xl">
                              Layton
                            </span>
                          </Link>
                        </Dialog.Title>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        {friends.length > 0 ? (
                          <p className="text-xs font-semibold leading-6 text-gray-400">
                            Your chats
                          </p>
                        ) : null}
                        <nav className="flex h-auto flex-1 flex-col">
                          <ul
                            role="list"
                            className="flex  flex-1 flex-col gap-7 "
                          >
                            <li>
                              <SidebarChatList
                                sessionId={session.user.id}
                                friends={friends}
                              />{" "}
                            </li>
                            <li>
                              <h3 className="text-xs font-semibold leading-6 text-gray-400">
                                Overview
                              </h3>

                              <ul
                                role="list"
                                className="-mx-2 mt-2  space-y-1 "
                              >
                                {sideBarOptions.map((option) => (
                                  <li key={option.id}>
                                    <Link
                                      href={option.href}
                                      className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                    >
                                      <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 group-hover:border  flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium bg-white">
                                        {option.Icon}
                                      </span>
                                      <span className="truncate">
                                        {option.name}
                                      </span>
                                    </Link>
                                  </li>
                                ))}
                                <li>
                                  <FriendRequestSidebarOptions
                                    sessionId={session.user.id}
                                    initialUnseenRequestsCount={
                                      unseenRequestsCount
                                    }
                                  />
                                </li>
                              </ul>
                            </li>
                          </ul>
                          <li className="absolute bottom-0 -mx-6 flex items-center">
                            <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
                              <div className="relative h-8 w-8 bg-gray-50">
                                <Image
                                  fill
                                  referrerPolicy="no-referrer"
                                  className="rounded-full"
                                  src={session.user.image || ""}
                                  alt="Your profile picture"
                                />
                              </div>

                              <span className="sr-only">Your profile</span>
                              <div className="flex flex-col">
                                <span aria-hidden="true">
                                  {session.user.name}
                                </span>
                                <span
                                  className="text-xs text-zinc-400"
                                  aria-hidden="true"
                                >
                                  {session.user.email}
                                </span>
                              </div>
                            </div>

                            <SignOutButton className=" aspect-square w-full p-2 h-auto" />
                          </li>
                        </nav>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default MobileChatLayout;
