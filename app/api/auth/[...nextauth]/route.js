import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from "axios";

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
                    console.log({a:'hit here'});
                    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                        email: credentials.email,
                        password: credentials.password
                    })
                    const data = res.data?.data;

                    if (data?.token && data?.user) {
                        return {
                            token: data.token,
                            user: data.user
                        };
                    } else {
                        return null;
                    }
                } catch (error) {
                    console.error('Login Failed', error.response?.data || error.message)
                    return null
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accesToken = user.token
                token.user = user.user
            }
            return token
        },
        async session({ session, token }) {
            session.accesToken = token.accesToken
            session.user = token.user
            return session
        }
    },
    pages: {
        signIn: '/auth/login-client'
    }
})

export { handler as GET, handler as POST };