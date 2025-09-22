import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import ChatSideBar from '@/components/ChatSideBar';
import PdfViewer from '@/components/PdfViewer';
import Chat from '@/components/Chat';

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const userChats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!userChats) {
    return redirect("/");
  }
  if (!userChats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/");
  }
  if (!userChats.length) return redirect("/");

  // Encuentra el chat actual
  const currentChat = userChats.find(chat => chat.id === Number(chatId));
  if (!currentChat) return redirect("/");

  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        <div className="flex-[1] max-w-xs">
          <ChatSideBar chats={userChats} chatId={Number(chatId)} />
        </div>
        <div className="max-h-screen p-4 overflow-scroll flex-[5]">
          <PdfViewer pdf_url={currentChat.pdfUrl || ''} />
        </div>
        <div className="flex-[3] border-l-4 border-l-slate-200">
          <Chat chatId={Number(chatId)} />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
