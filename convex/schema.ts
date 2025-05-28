// Note: the indices by_id and by_creation_time are automatically created by Convex

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  messages: defineTable({
    content: v.string(),
    sender: v.union(v.literal("user"), v.literal("komodo")),
    userId: v.string(),
    userName: v.string(),
    createdAt: v.number(),
  }).index("by_user_id", ["userId"]),

  audioFiles: defineTable({
    userId: v.id("users"),
    fileName: v.string(),
    mimeType: v.string(),
    storageId: v.string(),
    createdAt: v.number(),
  }).index("by_user_id", ["userId"]),

  chats: defineTable({
    userId: v.id("users"),
    createdAt: v.number(),
    messages: v.array(
      v.object({
        sender: v.union(v.literal("user"), v.literal("komodo")),
        message: v.string(),
        storageId: v.optional(v.id("_storage")),
        percentComplete: v.optional(v.number()),
      })
    ),
  }).index("by_user_id", ["userId"]),
});
