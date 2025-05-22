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
  const [percentComplete, setPercentComplete] = useState(0);
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

  useEffect(() => {
    if (
      chat?.messages &&
      chat.messages.length > 0 &&
      chat.messages[chat.messages.length - 1].sender === "komodo"
    ) {
      setResponse(chat.messages[chat.messages.length - 1].message);
      setLoading(false);
    }
  }, [chat?.messages]);

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
      percentComplete: undefined,
    });

    const res = await handleSendMessage(text);

    if (!res) {
      return;
    }

    const response = res.response;
    const percentComplete = res.percent_complete;
    const userInformation = res.user_information;
    const missingInformation = res.missing_information;

    setPercentComplete(percentComplete);

    await addMessage({
      chatId: chatId as Id<"chats">,
      content: response || "",
      storageId: undefined,
      percentComplete: percentComplete,
      sender: "komodo",
    });
  };

  const handleSendMessage = async (prompt: string) => {
    setLoading(true);
    setError("");
    setResponse("");

    const messages =
      chat?.messages.map((msg) => ({
        role:
          msg.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: msg.message,
      })) || [];

    if (messages[messages.length - 1].role === "assistant") {
      messages.push({
        role: "user",
        content: prompt,
      });
    }

    try {
      const result = await generateResponse({ messages });
      if (!result.success) {
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
                  .filter((msg, index) => {
                    const isLastMessage = index === chat.messages.length - 1;
                    return !(isLastMessage && msg.sender === "komodo");
                  })
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
            {percentComplete > 80 && (
              <div>
                <div className="text-sm text-gray-500">
                  {percentComplete}% complete
                </div>
                <button className="bg-blue-500 text-white p-2 rounded-md disabled:opacity-50">
                  See my recommendations!
                </button>
              </div>
            )}
          </Card>
        )}
      </MainContent>
    </PageContainer>
  );
}
