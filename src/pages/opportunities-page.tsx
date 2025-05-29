import React, { useEffect, useState } from "react";
import { PageContainer, MainContent } from "@/components/layout";
import { H1 } from "@/components/ui/typography";
import { useNavigate } from "react-router-dom";
import { OpportunityCard } from "@/components/opportunity-card";
import { Opportunity, parseOpportunities } from "@/lib/opportunities";

export function OpportunitiesPage() {
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