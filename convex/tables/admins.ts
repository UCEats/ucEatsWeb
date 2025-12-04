import { v } from "convex/values";
import { mutation } from "../_generated/server";

const ADMIN_TOKEN="539153146f648f30ebf6a407c1362b9232915315b1c6b468a1d30d722ea2746b";

export const verifyAdminLogin = mutation({
  args: {
    username: v.string(),
    password: v.string()
  },
  handler: async (ctx, {username, password}) => {
    const admin = await ctx.db.query("admins").filter(q => q.eq(q.field("username"), username)).first();
    if (!admin) {
        return { success: false, message: "Invalid username" };
      }
  
      console.log("password entered:", password);
      console.log("password in db:", admin.password);
      console.log("typeof db password:", typeof admin.password);
      
      const isValid = password.trim() === String(admin.password).trim();
      console.log("isValid?", isValid);
  
      if (!isValid) {
        return { success: false, message: "Wrong password" };
      }
      return { success: true, adminToken: ADMIN_TOKEN };
    },
    //return await ctx.db.query("admins").collect();
  },
);