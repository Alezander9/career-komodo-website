import { ClaudeTest } from "@/components/ClaudeTest";
import { PageContainer, MainContent, Section } from "@/components/layout";
import { H1 } from "@/components/ui/typography";

export function TestPage() {
  return (
    <PageContainer>
      <MainContent>
        <Section>
          <H1 className="mb-6">Claude API Test Page</H1>
          <ClaudeTest />
        </Section>
      </MainContent>
    </PageContainer>
  );
} 