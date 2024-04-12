import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { notFound } from "next/navigation";
import React, { FC } from "react";
import FriendRequests from "@/components/FriendRequests";

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();
  const incomingSenderIds = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[];

  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      const sender = (await fetchRedis("get", `user:${senderId}`)) as string;
      const senderParsed = JSON.parse(sender) as User;
      return { senderId, senderEmail: senderParsed.email };
    })
  );
  return (
    <section className="pt-8">
      <h1 className="font-bold text-5xl mb-8">Add a friend</h1>
      <div className="flex flex-col gap-4">
        <FriendRequests
          incomingFriendRequests={incomingFriendRequests}
          sessionid={session.user.id}
        />
      </div>
    </section>
  );
};

export default page;
