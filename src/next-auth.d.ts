import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  storeId: string;
  storeSlug: string;
  storeName: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
