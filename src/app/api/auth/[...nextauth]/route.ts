import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db";
import bcrypt from "bcrypt";


const handler = NextAuth({
    session: {
        strategy: "jwt"
    },
    providers: [
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            email: { label: "email", type: "text"},
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials, req) {
            if (!credentials) return null;
            const { email, password } = credentials;
            const dbUser = await db.query.usersTable.findFirst({
              where: (user, { eq }) => eq(user.email, email),
            });
            if (!dbUser) return null;
            
            const isMatch = await bcrypt.compare(password, dbUser.password);

            if (isMatch) {
              return {
                id: dbUser.userId.toString(),
                name: dbUser.name
              }
            }
            return null
          }
        })
      ],
    
})

export { handler as GET, handler as POST }