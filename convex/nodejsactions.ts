"use node";

import { action } from "./_generated/server";
import Anthropic from "@anthropic-ai/sdk";
import { v } from "convex/values";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const CLAUDE_SYSTEM_PROMPT = `
You are a fun creative and helpful career advisor and therapist. You are the Career Komodo, a talking Komodo who helps people figure out career options at all stages in life by asking good questions.

The user already knows you are the career komodo and is ready to begin a natural conversation to learn more about themselves.

<instructions> 
Respond in short conversational messages. Do not include gestures or mannerisms.
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
      "label": "💫 OpportunityA",
      "description": "Short, engaging description of OpportunityA.",
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
    userProfile: v.string(),
    opportunitiesBlock: v.string()
  },
  handler: async (ctx, args) => {

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY ?? "",
    });

    const prompt = `
    User Profile:
    ${args.userProfile}

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
        tools: [{
          name: "star_map",
          description: "Generate a star map of career opportunities based on a user profile. The map shows relationships between different learning or career opportunities, represented as nodes in a graph with connections between related options.",
          input_schema: {
            type: "object",
            properties: {
              adjacency: {
                type: "object",
                description: "A graph structure showing connections between opportunities. Keys are opportunity names, values are arrays of connected opportunity names.",
                additionalProperties: {
                  type: "array",
                  items: { type: "string" }
                }
              },
              starData: {
                type: "object",
                description: "Details about each opportunity. Keys match the names used in the adjacency object.",
                additionalProperties: {
                  type: "object",
                  properties: {
                    label: { 
                      type: "string",
                      description: "A short name for the opportunity, typically including an emoji"
                    },
                    description: { 
                      type: "string",
                      description: "A brief description of what this opportunity offers"
                    },
                    links: {
                      type: "array",
                      description: "Optional relevant links for this opportunity",
                      items: {
                        type: "object",
                        properties: {
                          text: { type: "string", description: "Display text for the link" },
                          url: { type: "string", description: "URL for the link" }
                        }
                      }
                    }
                  }
                }
              },
              nodeTypes: {
                type: "object",
                description: "Classification of nodes into categories. MUST include both 'start' and 'end' arrays.",
                properties: {
                  start: { 
                    type: "array", 
                    description: "Array of opportunity names that are good starting points",
                    items: { type: "string" } 
                  },
                  end: { 
                    type: "array", 
                    description: "Array of opportunity names that are end goals or advanced options",
                    items: { type: "string" } 
                  }
                },
                required: ["start", "end"]
              }
            },
            required: ["adjacency", "starData", "nodeTypes"]
          }
        }],
        tool_choice: { type: "tool", name: "star_map" }
      });

      if (!response.content || response.content.length === 0) {
        throw new Error("Empty response from Claude");
      }

      const toolCall = response.content.find(
        item => item.type === 'tool_use' && item.name === 'star_map'
      );
      
      if (!toolCall || toolCall.type !== 'tool_use') {
        throw new Error("No tool use response found from Claude");
      }

      const input = toolCall.input as any;
      
      if (!input.adjacency || typeof input.adjacency !== 'object' || Object.keys(input.adjacency).length === 0) {
        console.warn("Missing or empty 'adjacency' field in Claude's response - using fallback");

        const opportunityMatches = args.opportunitiesBlock.match(/Name: ([^\n]+)/g) || [];
        const opportunities = opportunityMatches.map(match => match.replace("Name: ", "").trim());

        if (opportunities.length === 0) {
          const lines = args.opportunitiesBlock.split('\n').map(line => line.trim()).filter(Boolean);
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
          opportunities.forEach(opp => {
            input.starData[opp] = {
              label: `🌟 ${opp}`,
              description: `Educational opportunity: ${opp}`
            };
          });
          
          input.nodeTypes = {
            start: [opportunities[0]],
            end: [opportunities[opportunities.length - 1]]
          };
        } else {
          throw new Error("Not enough opportunity data to create a fallback structure");
        }
      }
      
      if (!input.starData || typeof input.starData !== 'object') {
        throw new Error("Missing or invalid 'starData' field in Claude's response");
      }
      
      if (!input.nodeTypes || typeof input.nodeTypes !== 'object' || 
          !input.nodeTypes.start || !input.nodeTypes.end) {
        const opportunityNames = Object.keys(input.adjacency);
        if (opportunityNames.length > 0) {
          input.nodeTypes = {
            start: [opportunityNames[0]],
            end: [opportunityNames[opportunityNames.length - 1]]
          };
          console.warn("Missing or invalid 'nodeTypes' field in Claude's response - using default");
        } else {
          throw new Error("Cannot create default nodeTypes with empty adjacency data");
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
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});

// type Args = {
//   keywords: string[]; // Now an array!
//   location: string;
// };

// export const scrapeLinkedInJobs = action(async (_ctx, args: Args) => {
//   const headers = {
//     "User-Agent":
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
//   };
//   const totalJobs = 50;
//   const jobsPerPage = 25;
//   const jobIds: string[] = [];
//   const jobsData: any[] = [];

//   // Join keywords with spaces, encode for URL
//   const combinedKeywords = encodeURIComponent(args.keywords.join(" "));
//   const encodedLocation = encodeURIComponent(args.location);

//   // 1. Collect job IDs
//   for (let i = 0; i < Math.ceil(totalJobs / jobsPerPage); i++) {
//     const url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${combinedKeywords}&location=${encodedLocation}&start=${i * jobsPerPage}`;
//     const res = await fetch(url, { headers });
//     const text = await res.text();
//     const $ = cheerio.load(text);
//     $("li").each((_, elem) => {
//       const jobDiv = $(elem).find("div.base-card");
//       const urn = jobDiv.attr("data-entity-urn");
//       if (urn) {
//         const jobId = urn.split(":")[3];
//         jobIds.push(jobId);
//       }
//     });
//   }

//   // 2. Scrape job details (unchanged)
//   for (const jobId of jobIds) {
//     const jobInfo: any = {};
//     const jobUrl = `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobId}`;
//     const res = await fetch(jobUrl, { headers });
//     const text = await res.text();
//     const $ = cheerio.load(text);

//     jobInfo.company =
//       $("div.top-card-layout__card a img").attr("alt") || null;
//     jobInfo["job-title"] =
//       $("div.top-card-layout__entity-info a").text().trim() || null;
//     const levelText = $("ul.description__job-criteria-list li")
//       .first()
//       .text();
//     jobInfo.level = levelText
//       ? levelText.replace("Seniority level", "").trim()
//       : null;

//     if (Object.values(jobInfo).some((val) => val)) {
//       jobsData.push(jobInfo);
//     }
//   }

//   console.log(jobsData);

//   return jobsData;
// });

type Args = {
  keywords: string[];
  location: string;
};

function cleanJobTitle(text: string): string {
  // Remove newlines and excessive whitespace
  let cleaned = text.replace(/\s+/g, " ");
  // Remove everything after 'See who' or 'User Agreement' or 'Apply on company website'
  cleaned = cleaned.split(/See who|User Agreement|Apply on company website/i)[0].trim();
  return cleaned;
}

export const scrapeLinkedInJobs = action(async (_ctx, args: Args) => {
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
  };
  const totalJobs = 50;
  const jobsPerPage = 25;
  const jobIds: string[] = [];
  const jobsData: any[] = [];

  // Join keywords with spaces, encode for URL
  const combinedKeywords = encodeURIComponent(args.keywords.join(" "));
  const encodedLocation = encodeURIComponent(args.location);

  // 1. Collect job IDs
  for (let i = 0; i < Math.ceil(totalJobs / jobsPerPage); i++) {
    const url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${combinedKeywords}&location=${encodedLocation}&start=${i * jobsPerPage}`;
    const res = await fetch(url, { headers });
    const text = await res.text();
    const $ = cheerio.load(text);
    $("li").each((_, elem) => {
      const jobDiv = $(elem).find("div.base-card");
      const urn = jobDiv.attr("data-entity-urn");
      if (urn) {
        const jobId = urn.split(":")[3];
        jobIds.push(jobId);
      }
    });
  }

  // 2. Scrape job details (with title cleaning)
  for (const jobId of jobIds) {
    const jobInfo: any = {};
    const jobUrl = `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobId}`;
    const res = await fetch(jobUrl, { headers });
    const text = await res.text();
    const $ = cheerio.load(text);

    jobInfo.company =
      $("div.top-card-layout__card a img").attr("alt") || null;

    // Clean the job title
    const rawTitle = $("div.top-card-layout__entity-info a").text() || "";
    jobInfo["job-title"] = cleanJobTitle(rawTitle);

    const levelText = $("ul.description__job-criteria-list li")
      .first()
      .text();
    jobInfo.level = levelText
      ? levelText.replace("Seniority level", "").trim()
      : null;

    if (Object.values(jobInfo).some((val) => val)) {
      jobsData.push(jobInfo);
    }
  }

  console.log(jobsData);

  return jobsData;
});