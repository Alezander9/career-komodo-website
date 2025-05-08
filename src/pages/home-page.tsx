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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <header className="w-full border-b border bg-background/80 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <Logo size="md" />
          <div className="flex items-center gap-4">
            <SignOutButton>
              <Button variant="outline" size="sm">
                Sign Out
              </Button>
            </SignOutButton>
          </div>
        </div>
      </header>

      {/* Main Content: Big Buttons Grid */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center mb-10 mt-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">
            Welcome, {user?.fullName || "Explorer"}!
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            What would you like to do today?
          </p>
        </div>
        <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featureRoutes.map((route) => (
            <Button
              key={route.path}
              size="lg"
              className="h-32 text-2xl font-semibold shadow-lg hover:scale-105 transition-transform duration-200"
              onClick={() => navigate(route.path)}
            >
              {route.name}
            </Button>
          ))}
        </div>
      </main>
    </div>
  );
}
