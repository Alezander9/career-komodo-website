import { PageContainer, MainContent, Card } from "@/components/layout";
import { H1 } from "@/components/ui/typography";
import { api } from "@convex/_generated/api";
import { useParams } from "react-router-dom";
import { useAction, useMutation, useQuery } from "convex/react";
import { ChatMessageList } from "@/components/chat-message";
import { SpeechToText } from "@/components/SpeechToText";
import { Id } from "@convex/_generated/dataModel";
import { useState, useEffect } from "react";
import { KomodoImage } from "@/components/KomodoImage";
import Typewriter from "./komodo-text";

export function Chat() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { chatId } = useParams();
  const chat = useQuery(api.queries.getChat, { chatId: chatId as Id<"chats"> });
  const addMessage = useMutation(api.mutations.addMessageToChat);
  const generateResponse = useAction(api.nodejsactions.generateClaudeResponse);

  useEffect(() => {
    if (chat?.messages.length === 0) {
      setResponse(
        "Hi! I'm the Career Komodo, your AI career coach. How can I help you today?"
      );
      addMessage({
        chatId: chatId as Id<"chats">,
        content:
          "Hi! I'm the Career Komodo, your AI career coach. How can I help you today?",
        storageId: undefined,
        sender: "komodo",
      });
    }
  }, [chat]);

  const handleTranscription = async ({
    text,
    storageId,
  }: {
    text: string;
    storageId: Id<"_storage">;
  }) => {
    await addMessage({
      chatId: chatId as Id<"chats">,
      content: text,
      storageId: storageId,
      sender: "user",
    });

    const res = await handleSendMessage(text);

    await addMessage({
      chatId: chatId as Id<"chats">,
      content: res || "",
      storageId: undefined,
      sender: "komodo",
    });
  };

  const handleSendMessage = async (prompt: string) => {
    setLoading(true);
    setError("");
    setResponse("");

    try {
      const result = await generateResponse({ prompt });
      if (result.success) {
        setResponse(result.response || "");
      } else {
        setError(result.error || "Unknown error occurred");
      }
      return result.response;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <MainContent>
        {chat && (
          <Card>
            <H1>Chat {new Date(chat.createdAt).toLocaleString()}</H1>
            <div className="flex-1 overflow-y-auto mb-4">
              <ChatMessageList
                messages={chat.messages
                  .filter((msg) => msg.message !== response)
                  .map(
                    (msg: { sender: "user" | "komodo"; message: string }) => ({
                      content: msg.message,
                      sender: msg.sender,
                      timestamp: new Date(chat.createdAt),
                      userName: msg.sender === "user" ? "You" : "Komodo",
                    })
                  )}
              />
              <div className="flex items-center">
                <KomodoImage />
                {loading && (
                  <Typewriter text="Komodo is thinking..." speed={20} />
                )}
                {response && <Typewriter text={response} speed={20} />}
              </div>
            </div>
            <SpeechToText onTranscription={handleTranscription} />
          </Card>
        )}
      </MainContent>
    </PageContainer>
  );
}
