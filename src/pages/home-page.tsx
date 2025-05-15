import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, SignOutButton } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import {
  PageContainer,
  MainContent,
  TwoColumnLayout,
  Card,
  Section,
} from "@/components/layout";
import { Logo } from "@/components/logo";
import { H2, H3, P } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import {
  ChatMessage,
  ChatInput,
  ChatMessageList,
  KomodoTypingIndicator,
  type ChatMessageProps,
} from "@/components/chat-message";

interface FeatureRoute {
  path: string;
  name: string;
  component?: React.ComponentType<any>;
}

interface HomePageProps {
  featureRoutes: FeatureRoute[];
}

// Define the message structure from the database
interface DbMessage {
  _id: string;
  _creationTime: number;
  content: string;
  sender: "user" | "komodo";
  userId: string;
  userName: string;
  createdAt: number;
}

export function HomePage({ featureRoutes }: HomePageProps) {
  const { user } = useUser();
  const navigate = useNavigate();
  const createUser = useMutation(api.mutations.createUser);
  const createMessage = useMutation(api.mutations.createMessage);
  const currentUser = useQuery(api.queries.getCurrentUser);
  const allMessages = useQuery(api.queries.getAllMessages) || [];
  const [isLoading, setIsLoading] = useState(false);

  // Create user on first login
  useEffect(() => {
    if (user && !currentUser) {
      createUser({
        name: user.fullName || "Anonymous",
        email: user.primaryEmailAddress?.emailAddress || "",
      });
    }
  }, [user, currentUser, createUser]);

  // Handle sending a message
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !user) return;

    setIsLoading(true);

    // Save to database
    await createMessage({
      content,
      sender: "user",
    });

    setIsLoading(false);
  };

  // Function to get user name for a message
  const getUserName = (msg: DbMessage) => {
    // If it's the current user's message
    if (currentUser && msg.userId === currentUser._id) {
      return `You (${msg.userName})`;
    }
    // Otherwise show the user's name
    return msg.userName;
  };

  return (
    <PageContainer>
      <header className="border-b border p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">
          <Button variant="outline" size="sm"
            onClick={() => navigate("/komodo-text")}>
              Komodo Text
            </Button>
          <SignOutButton>
            <Button variant="outline" size="sm">
              Sign Out
            </Button>
          </SignOutButton>
          </div>
        </div>
      </header>

      <MainContent>
        <TwoColumnLayout>
          {/* Left Column - Chat */}
          <Card className="flex flex-col h-[70vh]">
            <H3 className="mb-4">Global Chat Channel</H3>

            <div className="flex-1 overflow-y-auto mb-4">
              <ChatMessageList
                messages={allMessages.map((msg: DbMessage) => ({
                  content: msg.content,
                  sender: msg.sender,
                  timestamp: new Date(msg.createdAt),
                  userName: getUserName(msg),
                }))}
              />
              {isLoading && <KomodoTypingIndicator />}
            </div>

            <ChatInput onSendMessage={handleSendMessage} />
          </Card>

          {/* Right Column - Features */}
          <Card>
            <H3 className="mb-4">Features</H3>
            <P className="mb-6">Explore available features:</P>

            <div className="grid grid-cols-2 gap-4">
              {featureRoutes.map((route) => (
                <Button
                  key={route.path}
                  onClick={() => navigate(route.path)}
                  className="w-full"
                >
                  {route.name}
                </Button>
              ))}
            </div>
          </Card>
        </TwoColumnLayout>
      </MainContent>
    </PageContainer>
  );
}
