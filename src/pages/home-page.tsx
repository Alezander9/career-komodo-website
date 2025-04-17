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

interface StudentRoute {
  path: string;
  name: string;
  component?: React.ComponentType<any>;
}

interface HomePageProps {
  studentRoutes: StudentRoute[];
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

export function HomePage({ studentRoutes }: HomePageProps) {
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
          <SignOutButton>
            <Button variant="outline" size="sm">
              Sign Out
            </Button>
          </SignOutButton>
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

          {/* Right Column - Student Pages */}
          <Card>
            <H3 className="mb-4">Student Pages</H3>
            <P className="mb-6">Explore pages created by Stanford students:</P>

            <div className="grid grid-cols-2 gap-4">
              {studentRoutes.map((route) => (
                <Button
                  key={route.path}
                  onClick={() => navigate(route.path)}
                  className="w-full"
                >
                  {route.name}'s Page
                </Button>
              ))}
            </div>
          </Card>
        </TwoColumnLayout>
      </MainContent>
    </PageContainer>
  );
}
