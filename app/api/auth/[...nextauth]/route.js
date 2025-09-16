import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from "axios";
import { getDb } from "@/lib/db";
import bcrypt from 'bcrypt'
const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                try {
                    const { email, password } = credentials;

                    const db = getDb();
                    const [rows] = await db.query(
                        "SELECT * FROM users WHERE email = ? AND is_active = 1 AND role = ? LIMIT 1",
                        [email, 'patient']
                    );

                    if (rows.length === 0) return null;

                    const user = rows[0];

                    const validPassword = await bcrypt.compare(password, user.password);
                    if (!validPassword) return null;

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        gender: user.gender,
                        whatsapp_number: user.whatsapp_number,
                    };
                } catch (error) {
                    console.log(error);
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/login'
    }
})

export { handler as GET, handler as POST, handler as authOptions };