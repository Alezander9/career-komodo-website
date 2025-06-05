import { PageContainer, MainContent, Card, Section } from "@/components/layout";
import { H1 } from "@/components/ui/typography";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function AllChatsPage() {
  const chats = useQuery(api.queries.getChats);
  const createChat = useMutation(api.mutations.createChat);
  const navigate = useNavigate();

  const handleCreateChat = async () => {
    const chatId = await createChat();
    navigate(`/chat/${chatId}`);
  };

  return (
    <PageContainer>
      <MainContent>
        <div className="flex flex-col gap-4 max-w-md mx-auto">
          <div className="text-4xl font-bold text-center w-full mb-4">
            Conversations
          </div>
          <Button onClick={handleCreateChat}>+ New Conversation</Button>
          <div className="flex flex-col gap-4">
            {chats &&
              chats.map((chat) => (
                <Link to={`/chat/${chat._id}`}>
                  <Card key={chat._id}>
                    {new Date(chat.createdAt).toLocaleString()}
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </MainContent>
    </PageContainer>
  );
}
