import { mutation, query} from "../_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const linkSectionImage = mutation({
    args: {
      date: v.string(),
      section: v.union(v.literal("breakfast"), v.literal("lunch"), v.literal("dinner")),
      storageId: v.id("_storage"),
      fileName: v.string(),
    },
    handler: async (ctx, { date, section, storageId, fileName }) => {
      const imageUrl = await ctx.storage.getUrl(storageId);
  
      // Check if there's already an entry for this date + section
      const existing = await ctx.db
        .query("sectionImages")
        .withIndex("by_date_section", (q) => q.eq("date", date).eq("section", section))
        .first();
  
      if (existing) {
        // Update existing record
        await ctx.db.patch(existing._id, {
          storageId,
          imageUrl: imageUrl ?? undefined,
          fileName, // <-- store the filename here
        });
      } else {
        // Insert new record
        await ctx.db.insert("sectionImages", {
          date,
          section,
          storageId,
          imageUrl: imageUrl ?? undefined,
          fileName, // <-- store the filename here
        });
      }
  
      return { imageUrl, fileName };
    },
  });
  
  // convex/mutations/files.ts
export const deleteSectionImage = mutation({
  args: {
    date: v.string(), // format: "YYYY-MM-DD"
    section: v.union(v.literal("breakfast"), v.literal("lunch"), v.literal("dinner")),
  },
  handler: async (ctx, { date, section }) => {
    // Find the section image document for this date + section
    const sectionImage = await ctx.db
      .query("sectionImages")
      .withIndex("by_date_section", (q) => q.eq("date", date).eq("section", section))
      .first();

    if (!sectionImage) return { success: false, message: "No image found" };

    // Optionally delete the image from storage
    if (sectionImage.storageId) {
      await ctx.storage.delete(sectionImage.storageId);
    }

    // Delete the document from the table
    await ctx.db.delete(sectionImage._id);

    return { success: true };
  },
});

export const getSectionImage = query({
    args: {
      date: v.string(),
      section: v.union(v.literal("breakfast"), v.literal("lunch"), v.literal("dinner")),
    },
    handler: async (ctx, { date, section }) => {
      const sectionImage = await ctx.db
        .query("sectionImages")
        .withIndex("by_date_section", (q) => q.eq("date", date).eq("section", section))
        .first();
  
      if (!sectionImage) return null;
  
      return {
        imageUrl: sectionImage.imageUrl,
        fileName: sectionImage.fileName,
      };
    },
  });
