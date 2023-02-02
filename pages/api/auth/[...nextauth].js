import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";
const client = new MongoClient(process.env.MONGO_DB_URI);
const bcrypt = require("bcrypt");

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) token._id = user._id;

      return token;
    },
    async session({ session, token }) {
      if (token?._id) session.user._id = token._id;

      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await client.connect();
        const user = await client.db("bessa").collection("users").findOne({
          email: credentials.email.toLowerCase(),
        });
        await client.close();
        if (bcrypt.compareSync(credentials.password, user.password)) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_URL,
};
export default NextAuth(authOptions);
