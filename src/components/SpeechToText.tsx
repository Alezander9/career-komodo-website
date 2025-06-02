import { useReactMediaRecorder } from "react-media-recorder";
import { useAction, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useEffect, useState } from "react";
import { Id } from "@convex/_generated/dataModel";
import { AudioVisualizer } from "./AudioVisualizer";
import { Mic } from "lucide-react";

export function SpeechToText({
  onTranscription,
}: {
  onTranscription: (transcription: {
    text: string;
    storageId?: Id<"_storage">;
  }) => void;
}) {
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    previewAudioStream,
  } = useReactMediaRecorder({
    audio: true,
    mediaRecorderOptions: {
      mimeType: "audio/webm",
    },
  });
  const transcribeAudio = useAction(api.actions.audioToText);
  const generateUploadUrl = useMutation(api.mutations.generateUploadUrl);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    const recievedTranscription = await transcribeAudio({
      storageId,
      fileName: "audio.webm",
      deleteAudio: false,
    });
    setLoading(false);

    console.log("Transcription:", recievedTranscription.text);
    onTranscription({ text: recievedTranscription.text, storageId });
  };

  useEffect(() => {
    if (mediaBlobUrl) {
      handleTranscription(mediaBlobUrl);
    }
  }, [mediaBlobUrl]);

  useEffect(() => {
    if (previewAudioStream) {
      console.log("Preview audio stream:", previewAudioStream);
    }
  }, [previewAudioStream]);

  return (
    <div className="flex flex-col gap-4 items-center">
      {previewAudioStream && (
        <AudioVisualizer audioStream={previewAudioStream} />
      )}
      <button
        className={`border-2  shadow-lg text-white p-5 rounded-full disabled:border-gray-300/50 flex items-center justify-center w-min ${
          status === "recording"
            ? "shadow-blue-500/50 border-blue-500/50"
            : "shadow-white/50 border-white/50"
        }`}
        onClick={() => {
          if (status === "recording") {
            stopRecording();
          } else {
            startRecording();
          }
        }}
        disabled={loading}
      >
        <Mic
          className={`w-10 h-10  ${loading ? "text-gray-300 animate-pulse" : "text-white"}`}
        />
      </button>
    </div>
  );
}
