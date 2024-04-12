import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { messageArrayValidator } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";
import React, { FC } from "react";
import Messages from "@/components/Messages";
import ChatInput from "@/components/ChatInput";

interface pageProps {
  params: {
    chatId: string;
  };
}

async function getChatMessages(chatId: string) {
  try {
    const results: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    );

    const dbMessages = results.map((message) => JSON.parse(message) as Message);

    const reversedDbMessages = dbMessages.reverse();

    const messages = messageArrayValidator.parse(reversedDbMessages);

    return messages;
  } catch (error) {
    notFound();
  }
}

const page = async ({ params }: pageProps) => {
  const { chatId } = params;
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;

  const [userId1, userId2] = chatId.split("--");

  if (session.user.id !== userId1 && session.user.id !== userId2) {
    console.log(`${userId2} - id2, ${session.user.id}`);
    console.log(userId1);
    notFound();
  }

  const chatPartnerId = session.user.id === userId1 ? userId2 : userId1;

  const chatPartner = (await db.get(`user:${chatPartnerId}`)) as User;

  const initialMessages = await getChatMessages(chatId);

  return (
    <div className="flex flex-1 justify-between flex-col h-full max-h-[calc(100vh-6rem)]">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4 ">
          <div className="relative w-8 sm:w-12 h-8 sm:h-12 ">
            <Image
              fill
              referrerPolicy="no-referrer"
              src={chatPartner.image}
              alt="chat-partner"
              className="rounded-full"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <div className="text-xl flex items-center">
              <span className="text-gray-700 mr-3 font-semibold">
                {chatPartner.name}
              </span>
            </div>
            <span className="text-sm text-gray-600 ">{chatPartner.email}</span>
          </div>
        </div>
      </div>
      <Messages chatPartner={chatPartner} chatId={chatId} sessionImg={session.user.image} sessionId={session.user.id} initialMessages={initialMessages} />
      <ChatInput chatId={chatId} chatPartner={chatPartner} />
    </div>
  );
};

export default page;
