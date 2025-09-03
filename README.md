# Expense Tracker

A comprehensive expense tracking web application built with Next.js, MongoDB, and Google OAuth authentication. Track your expenses, categorize them, and get insights into your spending habits.

## Features

- 🔐 **Google OAuth Authentication** - Secure login with your Google account
- 💰 **Expense Management** - Add, edit, and delete expenses with ease
- 🏷️ **Custom Categories** - Create and manage expense categories with icons and colors
- 📍 **Location Tracking** - Track where you spend your money
- 📊 **Analytics & Insights** - Visual charts and reports of your spending patterns
- 📅 **Date Range Analysis** - Filter expenses by custom date ranges
- 📱 **Mobile Responsive** - Works perfectly on desktop and mobile devices
- ☁️ **Cloud Database** - Data stored securely in MongoDB Atlas

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Authentication**: NextAuth.js with Google OAuth
- **Charts**: Recharts
- **Deployment**: Vercel (free hosting)
- **Database**: MongoDB Atlas (free tier)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Google Cloud Console project for OAuth
- A MongoDB Atlas account (free tier available)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `env.example` to `.env.local` and fill in your values:
   
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NEXTAUTH_SECRET`: A random secret string (generate with `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for development)
   - `GOOGLE_CLIENT_ID`: From Google Cloud Console
   - `GOOGLE_CLIENT_SECRET`: From Google Cloud Console

4. **Set up Google OAuth**
   
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)

5. **Set up MongoDB Atlas**
   
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Create a database user
   - Get the connection string and add it to `.env.local`

6. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

1. **Push your code to GitHub**

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js project

3. **Set up environment variables in Vercel**
   - Go to your project settings in Vercel
   - Add all environment variables from your `.env.local`
   - Update `NEXTAUTH_URL` to your production URL

4. **Deploy**
   - Vercel will automatically deploy your app
   - Your app will be available at `https://your-app-name.vercel.app`

## Usage

### Adding Expenses

1. Sign in with your Google account
2. Create categories for your expenses (Food, Transport, etc.)
3. Add expenses with amount, description, category, place, and date
4. View your expenses in the expenses list

### Analytics

- View total spending and expense counts
- See spending breakdown by category
- Analyze monthly spending trends
- Identify top spending locations
- Filter analytics by date range

### Categories

- Create custom categories with icons and colors
- Edit existing categories
- Delete unused categories (if no expenses are linked)

## API Endpoints

- `GET /api/expenses` - Get user expenses with filtering
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/[id]` - Update expense
- `DELETE /api/expenses/[id]` - Delete expense
- `GET /api/categories` - Get user categories
- `POST /api/categories` - Create category
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category
- `GET /api/analytics` - Get spending analytics

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please create an issue in the repository.

---

Built with ❤️ using Next.js and MongoDB
