import { useNavigate } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";
import { PageContainer, MainContent, Card, Section } from "@/components/layout";
import { Logo } from "@/components/logo";
import { H1, H2, P } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

export function RyanPage() {
  const navigate = useNavigate();

  const studentName = "Ryan";

  return (
    <PageContainer>
      <header className="border-b border p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/home")}
            >
              Back to Home
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
        <Section>
          <H1 className="mb-6">{studentName}'s Page</H1>
          <Card>
            <H2 className="mb-4">Welcome to {studentName}'s Page</H2>
            <P className="mb-6">
              This is a placeholder page for {studentName}'s content. Each
              student will build their own unique features on this page.
            </P>
            <P>Students can experiment with:</P>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Custom UI components</li>
              <li>Interactive features</li>
              <li>Data visualization</li>
              <li>API integrations</li>
              <li>And more!</li>
            </ul>
          </Card>
        </Section>
      </MainContent>
    </PageContainer>
  );
}
