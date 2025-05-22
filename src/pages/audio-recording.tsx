import { useNavigate } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";
import { PageContainer, MainContent, Card, Section } from "@/components/layout";
import { Logo } from "@/components/logo";
import { H1, H2, P } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { useReactMediaRecorder } from "react-media-recorder";
import { useAction, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useEffect, useState } from "react";
import { SpeechToText } from "@/components/SpeechToText";
import { Id } from "@convex/_generated/dataModel";

export function AudioRecordingPage() {
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      mediaRecorderOptions: {
        mimeType: "audio/webm",
      },
    });
  const transcribeAudio = useAction(api.actions.audioToText);
  const generateUploadUrl = useMutation(api.mutations.generateUploadUrl);
  const [transcription, setTranscription] = useState("");
  const navigate = useNavigate();

  const handleTranscription = async ({
    text,
    storageId,
  }: {
    text: string;
    storageId: Id<"_storage">;
  }) => {
    setTranscription(text);
  };

  useEffect(() => {
    if (mediaBlobUrl) {
      console.log("Media blob URL:", mediaBlobUrl);
      handleTranscription(mediaBlobUrl);
    }
  }, [mediaBlobUrl]);

  return (
    <PageContainer>
      <header className="border-b border p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/komodo-text")}
            >
              Komodo Text
            </Button>
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
          <H1 className="mb-6">Audio Recording & Transcription</H1>
          <Card>
            <H2 className="mb-4">Record and Transcribe Audio</H2>
            <P className="mb-6">
              Record audio and get an instant transcription using AI. Perfect
              for note-taking and documentation.
            </P>
            <div className="mb-6">{transcription}</div>
            <SpeechToText onTranscription={handleTranscription} />
          </Card>
        </Section>
      </MainContent>
    </PageContainer>
  );
}
