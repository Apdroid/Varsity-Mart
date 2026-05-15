"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ConversationsSidebar } from "@/components/messages/conversations-sidebar"

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const inConversation = pathname !== "/messages"

  return (
    <div className="max-w-7xl mx-auto flex min-h-screen overflow-hidden">
      {/* Left — conversation list */}
      <aside
        className={cn(
          "flex flex-col border-r border-border bg-background",
          "w-full shrink-0 md:w-80 lg:w-96",
          inConversation ? "hidden md:flex" : "flex"
        )}
      >
        <ConversationsSidebar />
      </aside>

      {/* Right — active chat */}
      <main
        className={cn(
          "flex min-w-0 flex-1 flex-col",
          !inConversation ? "hidden md:flex" : "flex"
        )}
      >
        {children}
      </main>
    </div>
  )
}
