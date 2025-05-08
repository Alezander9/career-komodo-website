import { action } from "./_generated/server";
import { v } from "convex/values";

/**
 * Transcribe audio to text using OpenAI's Whisper API
 * @param storageId - The ID of the storage object containing the audio file
 * @param fileName - The name of the audio file
 * @param deleteAudio - Whether to delete the audio file from storage after transcription
 * @returns a json object with the text property set to the transcribed text
 */
export const audioToText = action({
  args: {
    storageId: v.id("_storage"),
    fileName: v.string(),
    deleteAudio: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { storageId, fileName, deleteAudio } = args;

    const audioUrl = await ctx.storage.getUrl(storageId);
    if (!audioUrl) {
      throw new Error("Failed to get audio URL");
    }

    const response = await fetch(audioUrl);
    const fileBlob = await response.blob();

    const formData = new FormData();
    formData.append("file", fileBlob, fileName);
    formData.append("model", "whisper-1");

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: formData,
      }
    );
    const data = (await openaiResponse.json()) as { text: string };

    if (deleteAudio) {
      await ctx.storage.delete(storageId);
    }

    return { text: data.text };
  },
});
