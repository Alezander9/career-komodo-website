import React from "react";
import { cn } from "@/lib/utils";
import { P, Small } from "@/components/ui/typography";

export interface ChatMessageProps {
  content: string;
  sender: "user" | "komodo";
  timestamp: Date;
  className?: string;
}

export function ChatMessage({
  content,
  sender,
  timestamp,
  className,
}: ChatMessageProps) {
  const isKomodo = sender === "komodo";

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isKomodo ? "justify-start" : "justify-end",
        className
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-3",
          isKomodo
            ? "bg-card text-card-foreground rounded-tl-none"
            : "bg-primary text-primary-foreground rounded-tr-none"
        )}
      >
        <P className="text-sm whitespace-pre-wrap break-words">{content}</P>
        <Small className="block text-right mt-1 opacity-70">
          {formatTime(timestamp)}
        </Small>
      </div>
    </div>
  );
}

export function KomodoTypingIndicator() {
  return (
    <div className="flex justify-start w-full mb-4">
      <div className="bg-card text-card-foreground rounded-lg rounded-tl-none p-3">
        <div className="flex space-x-2">
          <div
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export function ChatMessageList({
  messages,
  className,
}: {
  messages: ChatMessageProps[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col w-full overflow-y-auto", className)}>
      {messages.map((message, index) => (
        <ChatMessage key={index} {...message} />
      ))}
    </div>
  );
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  className,
}: {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  const [message, setMessage] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex items-center gap-2", className)}
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        disabled={disabled}
        className="flex-1 rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg transition-all duration-200 h-9 px-4 py-2"
      >
        Send
      </button>
    </form>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
