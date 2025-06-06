import { PageContainer, MainContent, Card, Section } from "@/components/layout";
import { H1 } from "@/components/ui/typography";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Id } from "@convex/_generated/dataModel";
import { useState } from "react";

export function ChatsSidebar({
  selectedChatId,
}: {
  selectedChatId: Id<"chats"> | null;
}) {
  const chats = useQuery(api.queries.getChats);
  const createChat = useMutation(api.mutations.createChat);
  const deleteChat = useMutation(api.mutations.deleteChat);
  const navigate = useNavigate();
  const [chatToDelete, setChatToDelete] = useState<Id<"chats"> | null>(null);

  const handleCreateChat = async () => {
    const chatId = await createChat();
    navigate(`/chat/${chatId}`);
  };

  const handleDeleteChat = async (chatId: Id<"chats">) => {
    await deleteChat({ chatId });
    setChatToDelete(null);
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
              <Link to={`/chat/${chat._id}`} key={chat._id}>
                <div
                  className={cn(
                    "text-sm text-gray-500 py-4 px-2 hover:cursor-pointer hover:bg-white/10 rounded-lg group relative",
                    selectedChatId === chat._id && "bg-white/10"
                  )}
                >
                  <div className="relative">
                    <span>{new Date(chat.createdAt).toLocaleString()}</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setChatToDelete(chat._id);
                      }}
                      className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/10 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {chatToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-red-500">
              Delete Conversation
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this conversation? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setChatToDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleDeleteChat(chatToDelete)}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
