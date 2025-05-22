import React, { useEffect, useState } from "react";
import { PageContainer, MainContent } from "@/components/layout";
import { H1 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { OpportunityCard } from "@/components/opportunity-card";
import { Opportunity, parseOpportunities } from "@/lib/opportunities";

export function OpportunitiesPage() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    // Fetch and parse opportunities data
    fetch('/opportunities.txt')
      .then(response => response.text())
      .then(text => {
        const parsedOpportunities = parseOpportunities(text);
        setOpportunities(parsedOpportunities);
      })
      .catch(error => {
        console.error('Error loading opportunities:', error);
      });
  }, []);

  const handleOpportunityClick = (name: string) => {
    const opportunityId = name.toLowerCase().replace(/\s+/g, '');
    navigate(`/opportunities/${opportunityId}`);
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
        <div className="container mx-auto py-8">
          <H1 className="mb-8">Learning Opportunities</H1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opportunity, index) => (
              <div 
                key={index}
                onClick={() => handleOpportunityClick(opportunity.name)}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <OpportunityCard
                  name={opportunity.name}
                  description={opportunity.description}
                />
              </div>
            ))}
          </div>
        </div>
      </MainContent>
    </PageContainer>
  );
} 