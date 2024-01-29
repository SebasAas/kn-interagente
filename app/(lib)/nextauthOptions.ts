import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import clientPromise from "./mongodb";
import { AuthOptions } from "next-auth";

export const nextauthOptions: AuthOptions = {
  // Configure one or more authentication providers
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      credentials: {
        email: {
          label: "E-mail",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        await client.db("users").command({ ping: 1 });

        // PRint successfull connection
        console.log("Connected successfully to server");

        const usersCollection = client
          .db(process.env.DB_NAME)
          .collection("users");

        const email = credentials?.email.toLowerCase();
        const user = await usersCollection.findOne({ email });

        if (!user) {
          throw new Error("User does not exist.");
        }
        //validate password
        const passwordIsValid = await bcrypt.compare(
          credentials?.password!,
          user.password
        );

        if (!passwordIsValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          ...user,
        };
      },
    }),
    // ...add more providers here
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          randomKey: token.randomKey,
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          randomKey: u.randomKey,
        };
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
