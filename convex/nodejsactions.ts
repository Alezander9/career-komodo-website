"use node";

import { action } from "./_generated/server";
import Anthropic from "@anthropic-ai/sdk";
import { v } from "convex/values";

const CLAUDE_SYSTEM_PROMPT = `
You are a fun creative and helpful career advisor and therapist. You are the Career Komodo, a talking Komodo who helps people figure out career options at all stages in life by asking good questions. Your goal is to gather enough information about the user to later generate a road map of personalized career opportunities. 

The user already knows you are the career komodo and is ready to begin a natural conversation to learn more about themselves.

<instructions> 
Given the messages between you and the user, create a JSON object in the following format:

js
{
  "percent_complete": "A number between 0 and 100 indicating how confident you are that you have enough information to generate a road map of personalized career opportunities. This will be used to determine when to stop asking questions.",
  "user_information": "A short description of information you have gathered about the user that will be relevant towards generating a road map of personalized career opportunities.",
  "missing_information": "A short description of information you are missing about the user that is necessary to generate a road map of personalized career opportunities."
  "response": "A short conversational message to the user that answers any of the user's questions but also gathers more information about the user that is necessary to generate a road map of personalized career opportunities. Try to only ask the user one question. Do not include gestures or mannerisms.",
}

IMPORTANT:
1. The "percent_complete" field MUST be included and MUST be a number between 0 and 100.
2. The "user_information" field MUST be included and MUST be a short description of information you have gathered about the user that will be relevant towards generating a road map of personalized career opportunities.
3. The "missing_information" field MUST be included and MUST be a short description of information you are missing about the user that is necessary to generate a road map of personalized career opportunities.
4. The "response" field MUST be included and MUST be a short conversational message to the user. It should answer any of the user's questions but also gather more information about the user that is necessary to generate a road map of personalized career opportunities. Do not include gestures or mannerisms.

</instructions>
`;

// Initialize the Anthropic client with the API key from Convex environment
export const generateClaudeResponse = action({
  args: {
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
      })
    ),
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
        messages: args.messages,
        tools: [
          {
            name: "career_komodo",
            description:
              "A career advisor and therapist who helps people figure out career options at all stages in life by asking good questions. Your goal is to gather enough information about the user to later generate a road map of personalized career opportunities.",
            input_schema: {
              type: "object",
              properties: {
                percent_complete: {
                  type: "number",
                  description:
                    "A number between 0 and 100 indicating how confident you are that you have enough information to generate a road map of personalized career opportunities. This will be used to determine when to stop asking questions.",
                },
                user_information: {
                  type: "string",
                  description:
                    "A short description of information you have gathered about the user that will be relevant towards generating a road map of personalized career opportunities.",
                },
                missing_information: {
                  type: "string",
                  description:
                    "A short description of information you are missing about the user that is necessary to generate a road map of personalized career opportunities.",
                },
                response: {
                  type: "string",
                  description:
                    "A short conversational message to the user that answers any of the user's questions but also gathers more information about the user that is necessary to generate a road map of personalized career opportunities. Try to only ask the user one question. Do not include gestures or mannerisms.",
                },
              },
              required: [
                "percent_complete",
                "user_information",
                "missing_information",
                "response",
              ],
            },
          },
        ],
        tool_choice: { type: "tool", name: "career_komodo" },
      });

      if (!response.content || response.content.length === 0) {
        throw new Error("Empty response from Claude");
      }

      // Extract the tool call response
      const toolCall = response.content.find(
        (item) => item.type === "tool_use" && item.name === "career_komodo"
      );

      if (!toolCall || toolCall.type !== "tool_use") {
        throw new Error("No tool use response found from Claude");
      }

      console.log(toolCall.input);

      // Validate the response contains all required fields
      const input = toolCall.input as {
        response: string;
        percent_complete: number;
        user_information: string;
        missing_information: string;
      };

      return {
        success: true,
        response: input,
      };
    } catch (error) {
      console.error("Error calling Claude API:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});

const STARMAP_SYSTEM_PROMPT = `
Prompt:

You are a career mapping assistant.

<instructions>

Given the following information:

Conversation History with User:
A list of messages between you and the user, exploring their career goals and interests.

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
      "label": "💫 OpportunityA",
      "description": "Short, engaging description of OpportunityA and how it is relevant to the user's career goals and interests.",
      "links": [{ "text": "Link Text", "url": "https://example.com" }]
    },
    ...
  },
  "nodeTypes": {
    "start": ["OpportunityA", "OpportunityB"],
    "end": ["OpportunityY", "OpportunityZ"]
  }
}

IMPORTANT:
1. The "nodeTypes" field MUST be included and MUST contain both "start" and "end" arrays.
2. "start" should include at least one opportunity that's good for beginners.
3. "end" should include at least one opportunity that represents an advanced option.
4. Every opportunity name used in "adjacency" must exist as a key in "starData".
5. The "label" for each opportunity should include a relevant emoji.
6. The "description" for each opportunity should be a short, engaging description of how the opportunity is relevant to the user's career goals and interests.

Input:

Conversation History with User:
{conversation_history}

Opportunities:
{opportunities_list}

OUTPUT ONLY JSON. ONLY REAL JSON. NOTHING ELSE.

</instructions>
`;

export const generateStarMapResponse = action({
  args: {
    conversationHistory: v.array(
      v.object({
        sender: v.union(v.literal("user"), v.literal("komodo")),
        message: v.string(),
      })
    ),
    opportunitiesBlock: v.string(),
  },
  handler: async (ctx, args) => {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY ?? "",
    });

    const prompt = `
    Conversation History with User:
    ${args.conversationHistory}

    Opportunities:
    ${args.opportunitiesBlock}
    `.trim();

    try {
      const response = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
        system: STARMAP_SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        tools: [
          {
            name: "star_map",
            description:
              "Generate a star map of career opportunities based on a user profile. The map shows relationships between different learning or career opportunities, represented as nodes in a graph with connections between related options.",
            input_schema: {
              type: "object",
              properties: {
                adjacency: {
                  type: "object",
                  description:
                    "A graph structure showing connections between opportunities. Keys are opportunity names, values are arrays of connected opportunity names.",
                  additionalProperties: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
                starData: {
                  type: "object",
                  description:
                    "Details about each opportunity. Keys match the names used in the adjacency object.",
                  additionalProperties: {
                    type: "object",
                    properties: {
                      label: {
                        type: "string",
                        description:
                          "A short name for the opportunity, typically including an emoji",
                      },
                      description: {
                        type: "string",
                        description:
                          "A brief description of what this opportunity is and how it is relevant to the user's career goals and interests.",
                      },
                      links: {
                        type: "array",
                        description:
                          "Optional relevant links for this opportunity",
                        items: {
                          type: "object",
                          properties: {
                            text: {
                              type: "string",
                              description: "Display text for the link",
                            },
                            url: {
                              type: "string",
                              description: "URL for the link",
                            },
                          },
                        },
                      },
                    },
                  },
                },
                nodeTypes: {
                  type: "object",
                  description:
                    "Classification of nodes into categories. MUST include both 'start' and 'end' arrays.",
                  properties: {
                    start: {
                      type: "array",
                      description:
                        "Array of opportunity names that are good starting points",
                      items: { type: "string" },
                    },
                    end: {
                      type: "array",
                      description:
                        "Array of opportunity names that are end goals or advanced options",
                      items: { type: "string" },
                    },
                  },
                  required: ["start", "end"],
                },
              },
              required: ["adjacency", "starData", "nodeTypes"],
            },
          },
        ],
        tool_choice: { type: "tool", name: "star_map" },
      });

      if (!response.content || response.content.length === 0) {
        throw new Error("Empty response from Claude");
      }

      const toolCall = response.content.find(
        (item) => item.type === "tool_use" && item.name === "star_map"
      );

      if (!toolCall || toolCall.type !== "tool_use") {
        throw new Error("No tool use response found from Claude");
      }

      const input = toolCall.input as any;

      if (
        !input.adjacency ||
        typeof input.adjacency !== "object" ||
        Object.keys(input.adjacency).length === 0
      ) {
        console.warn(
          "Missing or empty 'adjacency' field in Claude's response - using fallback"
        );

        const opportunityMatches =
          args.opportunitiesBlock.match(/Name: ([^\n]+)/g) || [];
        const opportunities = opportunityMatches.map((match) =>
          match.replace("Name: ", "").trim()
        );

        if (opportunities.length === 0) {
          const lines = args.opportunitiesBlock
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);
          opportunities.push(...lines);
        }

        if (opportunities.length >= 2) {
          input.adjacency = {};

          for (let i = 0; i < opportunities.length; i++) {
            const current = opportunities[i];
            const next = opportunities[i + 1];
            input.adjacency[current] = next ? [next] : [];
          }

          input.starData = {};
          opportunities.forEach((opp) => {
            input.starData[opp] = {
              label: `🌟 ${opp}`,
              description: `Educational opportunity: ${opp}`,
            };
          });

          input.nodeTypes = {
            start: [opportunities[0]],
            end: [opportunities[opportunities.length - 1]],
          };
        } else {
          throw new Error(
            "Not enough opportunity data to create a fallback structure"
          );
        }
      }

      if (!input.starData || typeof input.starData !== "object") {
        throw new Error(
          "Missing or invalid 'starData' field in Claude's response"
        );
      }

      if (
        !input.nodeTypes ||
        typeof input.nodeTypes !== "object" ||
        !input.nodeTypes.start ||
        !input.nodeTypes.end
      ) {
        const opportunityNames = Object.keys(input.adjacency);
        if (opportunityNames.length > 0) {
          input.nodeTypes = {
            start: [opportunityNames[0]],
            end: [opportunityNames[opportunityNames.length - 1]],
          };
          console.warn(
            "Missing or invalid 'nodeTypes' field in Claude's response - using default"
          );
        } else {
          throw new Error(
            "Cannot create default nodeTypes with empty adjacency data"
          );
        }
      }

      return {
        success: true,
        response: input,
      };
    } catch (error) {
      console.error("Error calling Claude API:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});
