import { NextAuthOptions } from "next-auth"
// import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
// import { prisma } from "./prisma"
import { dummyUsers } from "./dummy-data"
import bcrypt from "bcryptjs"

// TODO: Uncomment and configure these providers when you have credentials
// import FacebookProvider from "next-auth/providers/facebook"
// import TwitterProvider from "next-auth/providers/twitter"
// import LinkedInProvider from "next-auth/providers/linkedin"

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // DUMMY AUTH: Use predefined dummy accounts
        // Email: john@example.com (Admin), jane@example.com (Team Lead), mike@example.com (Team Member)
        // Password: Any password works for demo
        
        const user = dummyUsers.find(u => u.email === credentials.email)
        
        if (user) {
          // For dummy data, any password works - no real verification
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image
          }
        }

        return null
      }
    }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_CLIENT_ID!,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    // }),
    // TwitterProvider({
    //   clientId: process.env.TWITTER_CLIENT_ID!,
    //   clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    //   version: "2.0", // for Twitter API v2
    // }),
    // LinkedInProvider({
    //   clientId: process.env.LINKEDIN_CLIENT_ID!,
    //   clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    // }),
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          role: user.role
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          role: token.role
        }
      }
    }
  },
  pages: {
    signIn: "/login",
    signUp: "/signup"
  },
  secret: process.env.NEXTAUTH_SECRET || "dummy-secret-for-development"
}

// Environment checks removed for dummy data setup 