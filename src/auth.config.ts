import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
    newUser: "/register",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;
      const role = auth?.user?.role;

      // 1. Redirection automatique des utilisateurs déjà connectés accédant aux pages d'authentification
      const isAuthRoute =
        pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/forgot-password";

      if (isLoggedIn && isAuthRoute) {
        let destination = "/account";
        if (role === "ADMIN") {
          destination = "/admin/dashboard";
        } else if (role === "PRO") {
          destination = "/pro/agenda";
        }
        return Response.redirect(new URL(destination, nextUrl));
      }

      // 2. Routes protégées Client : /account/*
      const isAccountRoute = pathname.startsWith("/account");
      if (isAccountRoute) {
        return isLoggedIn;
      }

      // 3. Routes protégées Pro : /pro/* sauf la landing page /pro et inscription /pro/join
      const isProDashboard =
        pathname.startsWith("/pro") &&
        pathname !== "/pro" &&
        pathname !== "/pro/join";

      if (isProDashboard) {
        if (!isLoggedIn) return false;
        return role === "PRO" || role === "ADMIN";
      }

      // 4. Routes protégées Super-Admin : /admin/*
      const isAdminRoute = pathname.startsWith("/admin");
      if (isAdminRoute) {
        if (!isLoggedIn) return false;
        return role === "ADMIN";
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.phone = user.phone;
        token.venueId = user.venueId;
        token.venueSlug = user.venueSlug;
        token.staffId = user.staffId;
      }

      // Supporte la mise à jour dynamique de session via trigger === "update"
      if (trigger === "update" && session?.user) {
        token = { ...token, ...session.user };
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) || session.user.id;
        session.user.role = (token.role as any) || "CUSTOMER";
        session.user.firstName = token.firstName as string | undefined;
        session.user.lastName = token.lastName as string | undefined;
        session.user.phone = token.phone as string | null | undefined;
        session.user.venueId = token.venueId as string | null | undefined;
        session.user.venueSlug = token.venueSlug as string | null | undefined;
        session.user.staffId = token.staffId as string | null | undefined;
      }
      return session;
    },
  },
  providers: [], // Initialisé avec CredentialsProvider dans src/lib/auth.ts
};
