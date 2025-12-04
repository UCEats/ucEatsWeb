import { v } from "convex/values";

export const adminAuthArgs = {
  adminToken: v.string(),
};

const ADMIN_TOKEN= "539153146f648f30ebf6a407c1362b9232915315b1c6b468a1d30d722ea2746b"
export function verifyAdmin(adminToken: string) {
  if (adminToken !==  ADMIN_TOKEN) {
    throw new Error("Unauthorized: Invalid admin token");
  }
}
