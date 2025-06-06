import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      clerkId: identity.subject,
      createdAt: Date.now(),
    });

    return userId;
  },
});

export const createMessage = mutation({
  args: {
    content: v.string(),
    sender: v.union(v.literal("user"), v.literal("komodo")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get user ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Create message
    const messageId = await ctx.db.insert("messages", {
      content: args.content,
      sender: args.sender,
      userId: user._id,
      userName: user.name,
      createdAt: Date.now(),
    });

    return messageId;
  },
});

export const createChat = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get user ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Create message
    const chatId = await ctx.db.insert("chats", {
      userId: user._id,
      createdAt: Date.now(),
      messages: [],
    });

    return chatId;
  },
});

export const deleteChat = mutation({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.chatId);
  },
});

export const addMessageToChat = mutation({
  args: {
    chatId: v.id("chats"),
    content: v.string(),
    storageId: v.optional(v.id("_storage")),
    sender: v.union(v.literal("user"), v.literal("komodo")),
    percentComplete: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { chatId, content, sender, storageId, percentComplete } = args;
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get user ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Create message
    const chat = await ctx.db.get(chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }

    const updatedChat = await ctx.db.patch(chatId, {
      messages: [
        ...chat.messages,
        {
          sender: sender,
          message: content,
          storageId: storageId,
          percentComplete: percentComplete,
        },
      ],
    });

    return updatedChat;
  },
});
