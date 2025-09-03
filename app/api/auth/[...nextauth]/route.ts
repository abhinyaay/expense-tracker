import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Only try to connect to DB if MongoDB URI is available
          if (process.env.MONGODB_URI) {
            await connectDB();
            
            // Check if user exists
            const existingUser = await User.findOne({ email: user.email });
            
            if (!existingUser) {
              // Create new user
              await User.create({
                name: user.name,
                email: user.email,
                image: user.image,
                googleId: account.providerAccountId,
              });
            }
          } else {
            console.log('MongoDB URI not configured, skipping database operations');
          }
          
          return true;
        } catch (error) {
          console.error('Error during sign in:', error);
          // Still allow sign in even if DB operations fail
          return true;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user?.email && process.env.MONGODB_URI) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: session.user.email });
          if (dbUser) {
            session.user.id = dbUser._id.toString();
          }
        } catch (error) {
          console.error('Error in session callback:', error);
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };
