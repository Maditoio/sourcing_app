import "next-auth";

declare module "next-auth" {
  interface User {
    role?: "user" | "admin";
    country?: string;
  }

  interface Session {
    user: {
      id: string;
      role: "user" | "admin";
      country?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "user" | "admin";
    country?: string;
  }
}
