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

  const handleTranscription = async (mediaBlobUrl: string) => {
    console.log("Starting transcription...");
    const audioBlob = await fetch(mediaBlobUrl).then((r) => r.blob());

    const postUrl = await generateUploadUrl();

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": "audio/webm" },
      body: audioBlob,
    });
    const { storageId } = await result.json();

    const recievedTranscription = await transcribeAudio({
      storageId,
      fileName: "audio.webm",
      deleteAudio: true,
    });

    console.log("Transcription:", recievedTranscription.text);
    setTranscription(recievedTranscription.text);
  };

  useEffect(() => {
    if (mediaBlobUrl) {
      console.log("Media blob URL:", mediaBlobUrl);
      handleTranscription(mediaBlobUrl);
    }
  }, [mediaBlobUrl]);

  return (
    <PageContainer>
      <MainContent>
        <Section>
          <H1 className="mb-6">Audio Recording & Transcription</H1>
          <Card>
            <H2 className="mb-4">Record and Transcribe Audio</H2>
            <P className="mb-6">
              Record audio and get an instant transcription using AI. Perfect
              for note-taking and documentation.
            </P>
            <div className="flex flex-col gap-4">
              <p>
                <span className="font-bold">Recording Status:</span> {status}
              </p>
              {status !== "recording" && (
                <button
                  className="bg-blue-500 text-white p-2 rounded-md disabled:opacity-50"
                  onClick={startRecording}
                  disabled={status === "recording"}
                >
                  Start Recording
                </button>
              )}
              {status === "recording" && (
                <button
                  className="bg-red-500 text-white p-2 rounded-md disabled:opacity-50"
                  onClick={() => {
                    stopRecording();
                  }}
                  disabled={status !== "recording"}
                >
                  Stop Recording
                </button>
              )}
              {mediaBlobUrl && (
                <div className="flex flex-col gap-2">
                  <audio src={mediaBlobUrl} controls />
                  <a
                    className="p-2 rounded-md bg-white text-black text-center"
                    href={mediaBlobUrl}
                    download="recording.webm"
                  >
                    Download
                  </a>
                </div>
              )}
              {transcription && (
                <div className="flex flex-col gap-2">
                  <p className="font-bold">Transcription:</p>
                  <p>{transcription}</p>
                </div>
              )}
            </div>
          </Card>
        </Section>
      </MainContent>
    </PageContainer>
  );
}
