import React from "react";
import { Card } from "@/components/layout";
import { H3, P } from "@/components/ui/typography";

interface OpportunityCardProps {
  name: string;
  description: string;
}

export function OpportunityCard({ name, description }: OpportunityCardProps) {
  return (
    <Card className="p-8 hover:shadow-lg transition-all duration-200 hover:scale-105 bg-gradient-to-br from-background to-accent/5">
      <H3 className="mb-4 text-2xl font-bold text-primary">{name}</H3>
      <P className="text-muted-foreground text-lg line-clamp-3">{description}</P>
    </Card>
  );
} 