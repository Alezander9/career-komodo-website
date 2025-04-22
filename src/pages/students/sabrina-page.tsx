import { useNavigate } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";
import { PageContainer, MainContent, Card, Section } from "@/components/layout";
import { Logo } from "@/components/logo";
import { H1, H2, P } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { useReactMediaRecorder } from "react-media-recorder";

export function SabrinaPage() {
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });
  const navigate = useNavigate();

  const studentName = "Sabrina";

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
            <div className="flex flex-col gap-4">
              <p>{status}</p>
              <button
                className="bg-blue-500 text-white p-2 rounded-md"
                onClick={startRecording}
              >
                Start Recording
              </button>
              <button
                className="bg-red-500 text-white p-2 rounded-md"
                onClick={stopRecording}
              >
                Stop Recording
              </button>
              <audio src={mediaBlobUrl} controls />
            </div>
          </Card>
        </Section>
      </MainContent>
    </PageContainer>
  );
}
