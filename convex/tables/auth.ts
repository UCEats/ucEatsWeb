import { v } from "convex/values";

export const adminAuthArgs = {
  adminToken: v.string(),
};

export function verifyAdmin(adminToken: string) {
  if (adminToken !==  process.env.ADMIN_TOKEN) {
    throw new Error("Unauthorized: Invalid admin token");
  }
}
