import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'
import ChatSideBar from '@/components/ChatSideBar';
import PdfViewer from '@/components/PdfViewer';
import Chat from '@/components/Chat';


type ChatPageProps = {
  params: { chatId: string };
};

export default async function Chatpage({ params }: ChatPageProps) {
  const { chatId } = params;
  const { userId } = await auth();

  if (!userId) return redirect('/sign-in');

  const chatsCollection = await db
    .select()
    .from(chats)
    .where(eq(chats.userId, userId));

  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats) {
    return redirect("/");
  }
  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/");
  }
  const currentChat = _chats.find(chat => chat.id === Number(chatId));

  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        <div className="flex-[1] max-w-xs">
          <ChatSideBar chats={chatsCollection} chatId={Number(chatId)} />
        </div>
        <div className="max-h-screen p-4 overflow-scroll flex-[5]">
          <PdfViewer pdf_url={currentChat?.pdfUrl || ''} />
        </div>
        <div className="flex-[3] border-l-4 border-l-slate-200">
          <Chat chatId={Number(chatId)}/>
        </div>
      </div>
    </div>
  );
}


// Removed duplicate default export
