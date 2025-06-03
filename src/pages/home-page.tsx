import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import {
  PageContainer,
  MainContent,
  SpaceBackground,
} from "@/components/layout";
import { Logo } from "@/components/logo";
import { H1, Lead } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

interface FeatureRoute {
  path: string;
  name: string;
  component?: React.ComponentType<any>;
}

export function HomePage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const createUser = useMutation(api.mutations.createUser);
  const currentUser = useQuery(api.queries.getCurrentUser);

  // Create user on first login
  useEffect(() => {
    if (user && !currentUser) {
      createUser({
        name: user.fullName || "Anonymous",
        email: user.primaryEmailAddress?.emailAddress || "",
      });
    }
  }, [user, currentUser, createUser]);

  return (
    <PageContainer>
      <MainContent>
        <SpaceBackground>
          <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
            <H1 className="mb-4">Welcome to Career Komodo</H1>

            <Lead className="max-w-2xl mb-8">
              Explore career paths and alternatives to four-year college
              education with our AI-powered guide.
            </Lead>

            <div className="relative z-50 flex flex-col gap-4">
              <Button
                size="lg"
                className="animate-pulse-slow"
                onClick={() => navigate("/chats")}
              >
                Chat
              </Button>
              <Button
                size="lg"
                className="animate-pulse-slow"
                onClick={() => navigate("/opportunities")}
              >
                Explore Opportunities
              </Button>
            </div>
          </div>
        </SpaceBackground>
      </MainContent>
    </PageContainer>
  );
}
