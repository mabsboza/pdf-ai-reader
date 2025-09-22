import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, LogIn } from "lucide-react";
import Link from "next/link";


export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;
  let firstChat;
  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId));
    if (firstChat) {
      firstChat = firstChat[0];
    }
  }
  return (
    <div className="w-screen h-screen bg-gradient-to-r from-blue-300 to-teal-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex flex-col items-center">
            <h1 className="text-5xl font-bold mb-4 text-gray-800">
              Lector de PDF con IA
            </h1>
            <p className="text-lg mb-8 text-gray-600">
              Sube un PDF y chatea con su contenido
            </p>
            <UserButton afterSignOutUrl="/" />
          </div>
          <div className="w-full mt-4">
            {isAuth ? (<FileUpload />) :
            (<Link href='/sign-in'>
              <Button>Logueate para subir un PDF
                <LogIn className="w-4 h-4 ml-2"/>
              </Button>
            </Link>)}
          </div>
          <div className="flex mt-10">
            {isAuth && firstChat && (
              <>
                <Link href={`/chat/${firstChat.id}`}>
                  <Button>
                    Ir al historial <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
