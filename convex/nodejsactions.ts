"use node";

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

const STARMAP_SYSTEM_PROMPT = `
Prompt:

You are a career mapping assistant.

<instructions>

Given the following information:

User Profile:
A text description of a user's background, skills, interests, and career goals.

List of Opportunities:
A list of career opportunities, each described in text form. Each opportunity may include a name, a description, and optionally useful links.

Your task:
Analyze the user profile and the list of opportunities. Then, create a JSON object in the following format (called StarMapJSON):

js
{
  "adjacency": {
    "OpportunityA": ["OpportunityB", "OpportunityC"],
    "OpportunityB": ["OpportunityA", "OpportunityD"],
    ...
  },
  "starData": {
    "OpportunityA": {
      "label": "Emoji OpportunityA",
      "description": "Short, engaging description of OpportunityA.",
      "links": [{ "text": "Link Text", "url": "https://example.com" }]
    },
    ...
  },
  "nodeTypes": {
    "start": ["OpportunityA"],
    "end": ["OpportunityZ"]
  }
}

Input:

User Profile:
{user_profile}

Opportunities:
{opportunities_list}

OUTPUT ONLY JSON. ONLY REAL JSON. NOTHING ELSE.

</instructions>
`
export const generateStarMapResponse = action({
  args: {
    prompt: v.string(),
  },
  handler: async (ctx, args) => {

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY ?? "", //worked with manually inputting key whoops
    });

    try {
      const response = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
        system: STARMAP_SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: args.prompt,
          },
        ],
      });

      console.log("Claude raw response:", response.content[0]);

      if (
        !response.content ||
        !response.content[0] ||
        response.content[0].type !== 'text'
      ) {
        throw new Error("Unexpected or missing response type from Claude");
      }

      const raw = response.content[0].text;

      const trimmed = raw.trim();

      const jsonStart = trimmed.indexOf('{');
      const jsonEnd = trimmed.lastIndexOf('}');
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("Claude's response did not contain a JSON object.");
      }
      const jsonString = trimmed.substring(jsonStart, jsonEnd + 1);

      let parsed;
      try {
        parsed = JSON.parse(jsonString);
      } catch (e) {
        throw new Error("Claude's response was not valid JSON: ");
      }

      return {
        success: true,
        response: parsed,
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