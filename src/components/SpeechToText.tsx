import { useReactMediaRecorder } from "react-media-recorder";
import { useAction, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useEffect, useState } from "react";
import { Id } from "@convex/_generated/dataModel";
import { Visualizer } from "react-sound-visualizer";

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
    <div className="flex flex-col gap-4">
      {previewAudioStream && (
        <Visualizer
          audio={previewAudioStream}
          strokeColor="#FFF"
          mode="current"
        >
          {({ canvasRef }) => (
            <canvas ref={canvasRef} width={500} height={100} />
          )}
        </Visualizer>
      )}
      {status !== "recording" && (
        <button
          className="bg-blue-500 text-white p-2 rounded-md disabled:opacity-50"
          onClick={startRecording}
          disabled={status === "recording" || loading}
        >
          {loading ? "Loading..." : "Start Recording"}
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
    </div>
  );
}
