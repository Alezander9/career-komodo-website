import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageContainer, MainContent, Card } from "@/components/layout";
import { H1, P } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { Opportunity, parseOpportunities } from "@/lib/opportunities";

export function OpportunityDetailPage() {
  const { opportunityId } = useParams();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);

  useEffect(() => {
    // Fetch and parse opportunities data
    fetch('/data/opportunities.txt')
      .then(response => response.text())
      .then(text => {
        const opportunities = parseOpportunities(text);
        const found = opportunities.find(opp => 
          opp.name.toLowerCase().replace(/\s+/g, '') === opportunityId?.toLowerCase()
        );
        setOpportunity(found || null);
      })
      .catch(error => {
        console.error('Error loading opportunities:', error);
      });
  }, [opportunityId]);

  if (!opportunity) {
    return (
      <PageContainer>
        <header className="border-b border p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Logo />
            <Button variant="outline" size="sm" onClick={() => navigate("/opportunities")}>
              Back to Opportunities
            </Button>
          </div>
        </header>
        <MainContent>
          <div className="container mx-auto py-8">
            <H1>Opportunity Not Found</H1>
            <P className="mt-4">The opportunity you're looking for doesn't exist.</P>
          </div>
        </MainContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <header className="border-b border p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/opportunities")}>
              Back to Opportunities
            </Button>
            {isSignedIn ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/home")}
              >
                Back to Home
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>

      <MainContent>
        <div className="container mx-auto py-12 px-4">
          <Card className="p-10 bg-gradient-to-br from-background to-accent/5">
            <div className="max-w-3xl mx-auto">
              <H1 className="text-4xl font-bold text-primary mb-8">{opportunity.name}</H1>
              <div className="prose prose-lg max-w-none">
                <P className="text-xl leading-relaxed whitespace-pre-line text-muted-foreground">
                  {opportunity.description}
                </P>
              </div>
            </div>
          </Card>
        </div>
      </MainContent>
    </PageContainer>
  );
} 