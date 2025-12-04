import bcrypt from "bcryptjs";
import { v } from "convex/values";
import { mutation } from "../_generated/server";

const hashedPassword = bcrypt.hashSync("admin123", 10);
console.log(hashedPassword);

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
  
      const isValid = await bcrypt.compareSync(password, admin.password)
  
      if (!isValid) {
        return { success: false, message: "Wrong password" };
      }

      const adminToken = ADMIN_TOKEN;
      if (!adminToken) {
        throw new Error("Server misconfiguration: ADMIN_TOKEN not set");
      }
      return { success: true, adminToken };
    },
    //return await ctx.db.query("admins").collect();
  },
);