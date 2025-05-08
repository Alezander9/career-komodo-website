import { PageContainer, MainContent, Card } from "@/components/layout";
import { H1 } from "@/components/ui/typography";
import { api } from "@convex/_generated/api";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { ChatMessageList } from "@/components/chat-message";
import { SpeechToText } from "@/components/SpeechToText";
import { Id } from "@convex/_generated/dataModel";

export function Chat() {
  const { chatId } = useParams();
  const chat = useQuery(api.queries.getChat, { chatId: chatId as Id<"chats"> });
  const addMessage = useMutation(api.mutations.addMessageToChat);

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
  };

  return (
    <PageContainer>
      <MainContent>
        {chat && (
          <Card>
            <H1>Chat {new Date(chat.createdAt).toLocaleString()}</H1>
            <div className="flex-1 overflow-y-auto mb-4">
              <ChatMessageList
                messages={chat.messages.map(
                  (msg: { sender: "user" | "komodo"; message: string }) => ({
                    content: msg.message,
                    sender: msg.sender,
                    timestamp: new Date(chat.createdAt),
                    userName: msg.sender === "user" ? "You" : "Komodo",
                  })
                )}
              />
            </div>
            <SpeechToText onTranscription={handleTranscription} />
          </Card>
        )}
      </MainContent>
    </PageContainer>
  );
}
