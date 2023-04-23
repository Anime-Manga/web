import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from "#auth";
const API_BASE = process.env.API_BASE_URL || 'http://localhost:5000';

export default NuxtAuthHandler({
    secret: process.env.NUXT_SECRET,
    pages: {
        // Change the default behavior to use `/login` as the path for the sign-in page
        signIn: '/auth/login'
    },
    providers: [
        CredentialsProvider.default({
            name: 'Credentials',
            async authorize (credentials: any) {
                try{
                    await $fetch(`${API_BASE}/auth/login`, {body:{username: credentials?.username, password: credentials?.password}, method: 'post'});
                    return {
                        name: credentials?.username,
                        password: credentials?.password
                    };
                }catch(err){
                    console.log(err);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        jwt: async ({token, user}) => {
          const isSignIn = user ? true : false;
          if (isSignIn) {
            token.password = user ? (user as any).password : undefined;
            
          }
          return Promise.resolve(token);
        },
        session: async ({session, token}) => {            
            return Promise.resolve(session);
        },
    },
})
