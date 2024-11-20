import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import { generateConsistentAnonymousName } from "@/utils/anonymousNames";

// This is a temporary user store. In production, you would use a database
const users = [
  {
    id: "1",
    email: "test@example.com",
    // Password: "password123"
    password: "$2a$10$xpRE9/LDt2VQtZ1JSAz/2OsV06PpAEsW7PSvnGOWylEMZupfc96Li"
  }
];

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-at-least-32-chars-long",
  debug: true, // Enable debug messages
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          console.log('Authorize function called with credentials:', { 
            email: credentials?.email,
            hasPassword: !!credentials?.password 
          });
          
          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials');
            throw new Error('Please provide both email and password');
          }

          const user = users.find(user => user.email === credentials.email);
          
          if (!user) {
            console.log('No user found for email:', credentials.email);
            throw new Error('Invalid email or password');
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          console.log('Password validation result:', isPasswordValid);

          if (!isPasswordValid) {
            console.log('Invalid password for user:', credentials.email);
            throw new Error('Invalid email or password');
          }

          // Generate a consistent anonymous name based on the user's ID
          const anonymousName = generateConsistentAnonymousName(user.id);
          console.log('Generated anonymous name:', anonymousName);

          console.log('Authorization successful for user:', user.email);
          return {
            id: user.id,
            name: anonymousName,
            email: user.email,
            anonymousName
          };
        } catch (error) {
          console.error('Authorization error:', error);
          throw error; // Re-throw the error to be handled by NextAuth
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.anonymousName = user.anonymousName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.anonymousName as string;
      }
      return session;
    }
  }
};

export default NextAuth(authOptions);
