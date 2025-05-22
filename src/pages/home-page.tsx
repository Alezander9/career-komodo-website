import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, SignOutButton } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import {
  PageContainer,
  MainContent,
  Card,
} from "@/components/layout";
import { Logo } from "@/components/logo";
import { H3, P } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
// import { Navbar } from "@/components/navbar";

interface FeatureRoute {
  path: string;
  name: string;
  component?: React.ComponentType<any>;
}

interface HomePageProps {
  featureRoutes: FeatureRoute[];
}

export function HomePage({ featureRoutes }: HomePageProps) {
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
        <Card className="max-w-2xl mx-auto">
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
      </MainContent>
    </PageContainer>
  );
}
