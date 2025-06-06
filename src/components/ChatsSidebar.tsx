import { PageContainer, MainContent, Card, Section } from "@/components/layout";
import { H1 } from "@/components/ui/typography";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Id } from "@convex/_generated/dataModel";

export function ChatsSidebar({
  selectedChatId,
}: {
  selectedChatId: Id<"chats"> | null;
}) {
  const chats = useQuery(api.queries.getChats);
  const createChat = useMutation(api.mutations.createChat);
  const navigate = useNavigate();

  const handleCreateChat = async () => {
    const chatId = await createChat();
    navigate(`/chat/${chatId}`);
  };

  return (
    <Card>
      <div className="flex flex-col gap-4">
        <div className="text-xl w-full">Conversations</div>
        <Button onClick={handleCreateChat}>
          <MessageCircle className="w-4 h-4" /> New Conversation
        </Button>
        <div className="flex flex-col">
          {chats &&
            chats.map((chat) => (
              <Link to={`/chat/${chat._id}`}>
                <div
                  className={cn(
                    "text-sm text-gray-500 py-4 px-2 hover:cursor-pointer hover:bg-white/10 rounded-lg",
                    selectedChatId === chat._id && "bg-white/10"
                  )}
                >
                  {new Date(chat.createdAt).toLocaleString()}
                </div>
              </Link>
            ))}
        </div>
      </div>
    </Card>
  );
}
