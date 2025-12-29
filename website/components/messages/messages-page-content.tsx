"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, Send, MoreVertical, Phone, ImageIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import { mockConversations } from "@/data/messages/conversations"
import { mockMessages } from "@/data/messages/messages"

export function MessagesPageContent() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [showConversations, setShowConversations] = useState(true)

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Conversations List */}
      <div
        className={cn(
          "w-full md:w-80 lg:w-96 border-r border-border flex flex-col bg-background",
          !showConversations && "hidden md:flex",
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold text-foreground mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search conversations..." className="pl-10" />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {mockConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => {
                setSelectedConversation(conversation)
                setShowConversations(false)
              }}
              className={cn(
                "w-full p-4 flex items-start gap-3 hover:bg-muted transition-colors text-left border-b border-border",
                selectedConversation.id === conversation.id && "bg-muted",
              )}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={conversation.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
                </Avatar>
                {conversation.user.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-primary border-2 border-background rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground">{conversation.user.name}</span>
                  <span className="text-xs text-muted-foreground">{conversation.time}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                {conversation.product && (
                  <div className="flex items-center gap-2 mt-2 p-2 bg-muted rounded-lg">
                    <div className="w-8 h-8 rounded overflow-hidden shrink-0">
                      <Image
                        src={conversation.product.image || "/placeholder.svg"}
                        alt={conversation.product.title}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground truncate">{conversation.product.title}</span>
                  </div>
                )}
              </div>
              {conversation.unread > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white shrink-0">
                  {conversation.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={cn("flex-1 flex flex-col bg-background", showConversations && "hidden md:flex")}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowConversations(true)}>
                  <Search className="h-5 w-5" />
                </Button>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedConversation.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{selectedConversation.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{selectedConversation.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedConversation.user.isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Product Banner */}
            {selectedConversation.product && (
              <div className="p-3 bg-muted/50 border-b border-border flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={selectedConversation.product.image || "/placeholder.svg"}
                    alt={selectedConversation.product.title}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{selectedConversation.product.title}</p>
                  <p className="text-xs text-muted-foreground">Discussing this product</p>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent shrink-0">
                  View
                </Button>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex", message.senderId === "me" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-2",
                      message.senderId === "me"
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm",
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={cn(
                        "text-xs mt-1",
                        message.senderId === "me" ? "text-primary/70" : "text-muted-foreground",
                      )}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setNewMessage("")
                }}
                className="flex items-center gap-2"
              >
                <Button type="button" variant="ghost" size="icon">
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-primary hover:bg-primary/90"
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  )
}
