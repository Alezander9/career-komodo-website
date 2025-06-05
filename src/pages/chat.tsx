import { PageContainer, MainContent, Card } from "@/components/layout";
import { api } from "@convex/_generated/api";
import { useNavigate, useParams } from "react-router-dom";
import { useAction, useMutation, useQuery } from "convex/react";
import { ChatMessageList } from "@/components/chat-message";
import { SpeechToText } from "@/components/SpeechToText";
import { Id } from "@convex/_generated/dataModel";
import { useState, useEffect } from "react";
import { KomodoImage } from "@/components/KomodoImage";
import Typewriter from "./komodo-text";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { ChatsSidebar } from "@/components/ChatsSidebar";

export function Chat() {
  const [response, setResponse] = useState("");
  const [percentComplete, setPercentComplete] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
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
        percentComplete: 0,
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
      if (
        chat.messages[chat.messages.length - 1].percentComplete !== undefined
      ) {
        setPercentComplete(
          chat.messages[chat.messages.length - 1].percentComplete ??
            percentComplete
        );
      }
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
        <div className="flex flex-row gap-4">
          <ChatsSidebar selectedChatId={chatId} />
          {chat && (
            <motion.div className="w-full h-full" layoutScroll>
              <Card>
                <div className="text-sm text-gray-500 mb-5">
                  {new Date(chat.createdAt).toLocaleString()}
                </div>
                <div className="flex-1 overflow-y-auto mb-4">
                  <ChatMessageList
                    messages={chat.messages
                      .filter((msg, index) => {
                        const isLastMessage =
                          index === chat.messages.length - 1;
                        return !(isLastMessage && msg.sender === "komodo");
                      })
                      .map(
                        (msg: {
                          sender: "user" | "komodo";
                          message: string;
                        }) => ({
                          content: msg.message,
                          sender: msg.sender,
                          timestamp: new Date(chat.createdAt),
                          userName: msg.sender === "user" ? "You" : "Komodo",
                        })
                      )}
                  />
                  <motion.div layout className="flex items-center">
                    <KomodoImage />
                    {loading && (
                      <Typewriter text="Komodo is thinking..." speed={20} />
                    )}
                    {response && <Typewriter text={response} speed={5} />}
                  </motion.div>
                </div>
                <SpeechToText onTranscription={handleTranscription} />
                {percentComplete >= 80 && (
                  <div className="flex justify-center mt-10">
                    <motion.button
                      initial={{
                        scale: 1,
                        boxShadow: "0 10px 15px -3px rgb(255, 255, 255, 0.5)",
                        border: "2px solid rgb(255, 255, 255, 0.5)",
                      }}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 10px 15px -3px rgb(255, 255, 255, 0.5)",
                        border: "2px solid rgb(255, 255, 255, 0.7)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="border-white/50 hover:border-white/70 border-2 shadow-md shadow-white/30 text-white py-2 px-7 rounded-full disabled:opacity-50 flex items-center justify-center gap-2"
                      onClick={() => {
                        navigate(`/starmap/${chatId}`);
                      }}
                    >
                      See recommendations!
                      <Sparkles className="w-4 h-4" />
                    </motion.button>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </div>
      </MainContent>
    </PageContainer>
  );
}
