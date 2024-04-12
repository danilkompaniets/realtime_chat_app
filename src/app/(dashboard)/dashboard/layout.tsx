import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React, { FC, ReactElement, ReactNode } from "react";
import { FaReact, FaUserFriends } from "react-icons/fa";
import { Icon } from "next/dist/lib/metadata/types/metadata-types";
import Image from "next/image";
import { VscSignOut } from "react-icons/vsc";
import SignOutButton from "@/components/SignOutButton";
import FriendRequestSidebarOptions from "@/components/FriendRequestSidebarOptions";
import { fetchRedis } from "@/helpers/redis";
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import SidebarChatList from "@/components/ui/SidebarChatList";
import MobileChatLayout from "@/components/MobileChatLayout";

export interface LayoutProps {
  children: ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);

  interface SideBarOption {
    id: number;
    name: string;
    href: string;
    Icon: ReactElement;
  }

  const sideBarOptions: SideBarOption[] = [
    {
      id: 1,
      name: "Add friend",
      href: "/dashboard/add",
      Icon: <FaUserFriends />,
    },
  ];

  if (!session) {
    notFound();
  }

  const friends = await getFriendsByUserId(session.user.id);

  const unseenRequestsCount = (
    (await fetchRedis(
      "smembers",
      `user:${session.user.id}:incoming_friend_requests`
    )) as User[]
  ).length;

  return (
    <div className="w-full flex h-screen ">
      <div className="md:hidden">
        <MobileChatLayout friends={friends} session={session} unseenRequestsCount={unseenRequestsCount} sideBarOptions={sideBarOptions}  />
      </div>
      <div className="hidden md:block  w-[350px] relative h-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        <Link href="/dashboard" className="flex h-16 gap-4 shrink-0 items-center ">
          <FaReact className="h-10 w-auto text-blue-700 transition-all hover:scale-105  hover:text-blue-500 hover:rotate-45" />
          <span className="text-blue-700 font-semibold text-xl">
            Layton
          </span>
        </Link>

        {friends.length > 0 ? (
          <p className="text-xs font-semibold leading-6 text-gray-400">
            Your chats
          </p>
        ) : null} 

        <nav className="flex h-auto flex-1 flex-col">
          <ul role="list" className="flex  flex-1 flex-col gap-7 ">
            <li>
              <SidebarChatList sessionId={session.user.id} friends={friends} />{" "}
            </li>
            <li>
              <h3 className="text-xs font-semibold leading-6 text-gray-400">
                Overview
              </h3>

              <ul role="list" className="-mx-2 mt-2  space-y-1 ">
                {sideBarOptions.map((option) => (
                  <li key={option.id}>
                    <Link
                      href={option.href}
                      className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                    >
                      <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 group-hover:border  flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium bg-white">
                        {option.Icon}
                      </span>
                      <span className="truncate">{option.name}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <FriendRequestSidebarOptions
                    sessionId={session.user.id}
                    initialUnseenRequestsCount={unseenRequestsCount}
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
                  <span aria-hidden="true">{session.user.name}</span>
                  <span className="text-xs text-zinc-400" aria-hidden="true">
                    {session.user.email}
                  </span>
                </div>
              </div>

              <SignOutButton className=" aspect-square w-full p-2 h-auto" />
            </li>
        </nav>
      </div>

      <aside className="mx-h-screen container py-4 mt-12 px-1 md:mt-0 md:px-3 md:py-8 w-full">
        {children}
      </aside>
    </div>
  );
};

export default Layout;
