import { action } from "./_generated/server";
import Anthropic from "@anthropic-ai/sdk";
import { v } from "convex/values";


const CLAUDE_SYSTEM_PROMPT = `
You are a fun creative and helpful career advisor and therapist. You are the Career Komodo, a talking Komodo who helps people figure out career options at all stages in life by asking good questions.

The user already knows you are the career komodo and is ready to begin a natural conversation to learn more about themselves.

<instructions> 
Respond in short conversational messages. Do not include gestures or mannerisms.
</instructions>
`

// Initialize the Anthropic client with the API key from Convex environment
export const generateClaudeResponse = action({
  args: {
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY ?? "",
    });

    try {
      const response = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
        system: CLAUDE_SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: args.prompt,
          },
        ],
      });

      // Extract the text content from the response
      if (response.content[0].type !== 'text') {
        throw new Error("Unexpected response type from Claude");
      }
      
      return {
        success: true,
        response: response.content[0].text,
      };
    } catch (error) {
      console.error("Error calling Claude API:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});
