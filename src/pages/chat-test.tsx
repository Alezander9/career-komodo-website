import { PageContainer, MainContent, Card, Section } from "@/components/layout";
import { H1 } from "@/components/ui/typography";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function AllChatsPage() {
  const chats = useQuery(api.queries.getChats);
  const createChat = useMutation(api.mutations.createChat);

  const handleCreateChat = async () => {
    await createChat();
  };

  return (
    <PageContainer>
      <MainContent>
        <div className="flex flex-col gap-4">
          <H1>Chats</H1>
          <div className="flex flex-col gap-4">
            {chats &&
              chats.map((chat) => (
                <Link to={`/chat/${chat._id}`}>
                  <Card key={chat._id}>
                    Chat created on {new Date(chat.createdAt).toLocaleString()}
                  </Card>
                </Link>
              ))}
          </div>
          <Button onClick={handleCreateChat}>Create Chat</Button>
        </div>
      </MainContent>
    </PageContainer>
  );
}
