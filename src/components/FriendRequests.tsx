"use client";

import React, { FC, useEffect } from "react";
import { useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import { RxCross1, RxCross2 } from "react-icons/rx";
import axios from "axios";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[];
  sessionid: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingFriendRequests,
  sessionid,
}) => {
  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionid}:incoming_friend_requests`)
    );

    const friendRequestHandler = ({
      senderId,
      senderEmail,
    }: IncomingFriendRequest) => {
      setFriendRequests((prev) => [...prev, { senderId, senderEmail }]);
    };

    pusherClient.bind("incoming_friend_requests", friendRequestHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionid}:incoming_friend_requests`)
      );
      pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
    };
  }, []);

  const router = useRouter();

  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  );

  const acceptFriend = async (senderId: string) => {
    await axios.post("/api/friends/accept", { id: senderId });

    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    );

    router.refresh();
  };

  const denyFriend = async (senderId: string) => {
    await axios.post("/api/friends/deny", { id: senderId });

    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    );

    router.refresh();
  };

  return (
    <>
      {friendRequests.length === 0 ? (
        <p className="text-sm text-zinc-500">Nothing to show here</p>
      ) : (
        friendRequests.map((request) => (
          <div
            key={request.senderId}
            className="flex gap-4 flex-col md:flex-row justify-start items-center "
          >
            <div className="flex gap-3">
              <FiUserPlus className="text-black w-6 h-auto" />
              <p className="font-medium text-lg ">{request.senderEmail}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => acceptFriend(request.senderId)}
                aria-label="accpet-friend"
                className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full hover:scale-105 transition-all hover:shadow-md"
              >
                <FaCheck className="h-1/2 w-auto text-white " />
              </button>
              <button
                onClick={() => denyFriend(request.senderId)}
                aria-label="deny-friend"
                className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full hover:scale-105 transition-all hover:shadow-md"
              >
                <RxCross2 className="font-semibold h-3/4 w-auto text-white " />
              </button>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;
