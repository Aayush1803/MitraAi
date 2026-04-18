import { NextAuthOptions, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),

    CredentialsProvider({
      name: 'Email & Password',
      credentials: {
        name:     { label: 'Full Name', type: 'text' },
        email:    { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        mode:     { label: 'Mode', type: 'text' }, // 'login' | 'signup'
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { email, password, name, mode } = credentials;

        if (mode === 'signup') {
          // ── Sign Up ──────────────────────────────────────────────────────────
          const existingUser = await prisma.user.findUnique({ where: { email } });
          if (existingUser) {
            throw new Error('An account with this email already exists.');
          }
          const hash = await bcrypt.hash(password, 12);
          const user = await prisma.user.create({
            data: {
              name: name || email.split('@')[0],
              email,
              passwordHash: hash,
            }
          });
          return { id: user.id, name: user.name, email: user.email, image: null };
        } else {
          // ── Login ─────────────────────────────────────────────────────────────
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) throw new Error('No account found with this email.');
          if (!user.passwordHash) throw new Error('Incorrect login method. Try Google OAuth.');
          const valid = await bcrypt.compare(password, user.passwordHash);
          if (!valid) throw new Error('Incorrect password.');
          return { id: user.id, name: user.name, email: user.email, image: user.image };
        }
      },
    }),
  ],

  session: { strategy: 'jwt' },

  pages: {
    signIn: '/',
    error: '/',
  },

  callbacks: {
    async jwt({ token, user, account, profile }: { token: JWT; user?: User; account?: any; profile?: any }) {
      if (user) {
        token.id = user.id;
        token.image = user.image ?? null;
      }

      // Persist Google User on first sign in
      if (account?.provider === 'google' && profile?.email) {
        const name = profile.name || profile.email.split('@')[0];
        const image = profile.picture || null;
        
        const dbUser = await prisma.user.upsert({
          where: { email: profile.email },
          update: { name, image },
          create: {
            email: profile.email,
            name,
            image,
          },
        });
        
        token.id = dbUser.id;
        token.image = dbUser.image;
      }
      
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        const tokenImage = token.image as string | null | undefined;
        session.user.image = tokenImage ?? session.user.image;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
