# 💰 Expense Tracker

A modern, full-featured expense tracking web application that helps you manage your finances with ease. Built with Next.js, MongoDB, and Google OAuth authentication, this app provides a seamless experience for tracking expenses, analyzing spending patterns, and making informed financial decisions.

## 📖 Description

Expense Tracker is a personal finance management tool that allows you to:
- **Track daily expenses** with detailed information including amount, description, category, location, and date
- **Organize expenses** using custom categories with personalized icons and colors
- **Analyze spending patterns** through interactive charts and visual analytics
- **Monitor financial health** with insights into spending trends, top categories, and location-based expenses
- **Access anywhere** with a fully responsive design that works on desktop, tablet, and mobile devices

The application uses secure Google OAuth authentication, ensuring your financial data remains private and protected. All data is stored securely in MongoDB Atlas cloud database.

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

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed and set up:

- **Node.js** (version 18 or higher) - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download Git](https://git-scm.com/)
- **Google Cloud Console account** - For OAuth setup
- **MongoDB Atlas account** - Free tier available

### Step-by-Step Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/abhinyaay/expense-tracker.git
cd expense-tracker
```

#### 2. Install Dependencies

Install all required npm packages:

```bash
npm install
```

This will install all dependencies including Next.js, React, MongoDB, NextAuth, and other required packages.

#### 3. Set Up MongoDB Atlas

1. **Create a MongoDB Atlas account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account (M0 Free Tier is sufficient)

2. **Create a Cluster**
   - Click "Create" or "Build a Database"
   - Choose the free M0 tier
   - Select your preferred cloud provider and region
   - Click "Create Cluster" (this may take a few minutes)

3. **Create a Database User**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (save these securely!)
   - Set user privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development, click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, add your specific IP addresses
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `expense-tracker` (or your preferred database name)

#### 4. Set Up Google OAuth

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Click the project dropdown and select "New Project"
   - Enter project name (e.g., "Expense Tracker")
   - Click "Create"

2. **Enable Google+ API**
   - In the project, go to "APIs & Services" > "Library"
   - Search for "Google+ API" or "Google Identity"
   - Click on it and press "Enable"

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - If prompted, configure the OAuth consent screen:
     - Choose "External" user type
     - Fill in app name, user support email, and developer contact
     - Add scopes: `email`, `profile`
     - Add test users if needed
   - For application type, select "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)
   - Click "Create"
   - Copy the **Client ID** and **Client Secret**

#### 5. Configure Environment Variables

1. **Create environment file**
   ```bash
   cp env.example .env.local
   ```

2. **Edit `.env.local`** with your values:

   ```env
   # MongoDB Atlas Connection String
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority
   
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-here-generate-a-random-string
   
   # Google OAuth Credentials
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

3. **Generate NEXTAUTH_SECRET**
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and paste it as your `NEXTAUTH_SECRET` value.

#### 6. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

Open your browser and navigate to the URL. You should see the Expense Tracker landing page.

#### 7. First Time Setup

1. Click "Get Started" or "Sign In"
2. Sign in with your Google account
3. You'll be redirected to the Dashboard
4. Create your first category (e.g., "Food", "Transport", "Shopping")
5. Add your first expense!

**Note:** Make sure your `.env.local` file is in the root directory and never commit it to version control (it's already in `.gitignore`).

## 🛠️ Available Scripts

The following scripts are available in the project:

- **`npm run dev`** - Start the development server at [http://localhost:3000](http://localhost:3000)
- **`npm run build`** - Build the production-ready application
- **`npm run start`** - Start the production server (run `npm run build` first)
- **`npm run lint`** - Run ESLint to check for code quality issues

## 🚀 Deployment to Vercel

Vercel is the recommended hosting platform for Next.js applications. Follow these steps to deploy:

### Prerequisites

- A GitHub account with your code pushed to a repository
- A Vercel account (free tier available)

### Deployment Steps

1. **Push Your Code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Sign up or log in with your GitHub account
   - Click "Add New Project"
   - Import your GitHub repository (`abhinyaay/expense-tracker`)
   - Vercel will automatically detect it's a Next.js project

3. **Configure Environment Variables**
   - In the project settings, go to "Environment Variables"
   - Add all variables from your `.env.local`:
     - `MONGODB_URI` - Your MongoDB Atlas connection string
     - `NEXTAUTH_SECRET` - Your NextAuth secret (same as development)
     - `NEXTAUTH_URL` - Your production URL (e.g., `https://your-app.vercel.app`)
     - `GOOGLE_CLIENT_ID` - Your Google OAuth Client ID
     - `GOOGLE_CLIENT_SECRET` - Your Google OAuth Client Secret
   - **Important**: Update your Google OAuth redirect URI in Google Cloud Console to include your Vercel URL:
     - `https://your-app.vercel.app/api/auth/callback/google`

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application
   - Your app will be available at `https://your-app-name.vercel.app`
   - Future pushes to the main branch will automatically trigger deployments

### Post-Deployment Checklist

- ✅ Verify the app loads correctly
- ✅ Test Google OAuth sign-in
- ✅ Test adding an expense
- ✅ Verify MongoDB connection
- ✅ Check analytics page loads correctly
- ✅ Test on mobile devices

### Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions
5. Update `NEXTAUTH_URL` in environment variables to your custom domain

## 📱 How to Use the App

### Getting Started

1. **Sign In**
   - Click "Get Started" on the landing page
   - Sign in with your Google account
   - You'll be automatically redirected to the Dashboard

2. **Dashboard Overview**
   - View your total expenses and expense count
   - See recent expenses at a glance
   - Access quick actions to add expenses, manage categories, view analytics, and see all expenses

### Managing Categories

Before adding expenses, it's recommended to set up your expense categories:

1. **Navigate to Categories**
   - Click "Categories" in the navigation menu
   - Or use the "Manage Categories" quick action on the Dashboard

2. **Create a Category**
   - Click "Add Category" button
   - Enter category name (e.g., "Food", "Transport", "Shopping", "Bills")
   - Choose an icon from the icon picker
   - Select a color for the category
   - Click "Create Category"

3. **Edit a Category**
   - Click the edit icon (pencil) next to any category
   - Modify the name, icon, or color
   - Click "Update Category"

4. **Delete a Category**
   - Click the delete icon (trash) next to a category
   - Note: Categories with linked expenses cannot be deleted
   - You must first delete or reassign all expenses in that category

### Adding Expenses

1. **Navigate to Add Expense**
   - Click "Expenses" in the navigation menu
   - Click "Add Expense" button
   - Or use the "Add Expense" quick action on the Dashboard

2. **Fill in Expense Details**
   - **Amount**: Enter the expense amount (required)
   - **Description**: Add a brief description of the expense (required)
   - **Category**: Select from your created categories (required)
   - **Place**: Enter where you made the expense (optional, e.g., "Starbucks", "Amazon")
   - **Date**: Select the date of the expense (defaults to today)

3. **Save the Expense**
   - Click "Add Expense" button
   - The expense will be saved and you'll be redirected to the expenses list

### Viewing and Managing Expenses

1. **View All Expenses**
   - Click "Expenses" in the navigation menu
   - See all your expenses in a list format
   - Expenses are sorted by date (newest first)

2. **Filter Expenses**
   - Use the filter options to view expenses by:
     - Category
     - Date range
     - Search by description or place

3. **Edit an Expense**
   - Click the edit icon (pencil) next to any expense
   - Modify any field
   - Click "Update Expense"

4. **Delete an Expense**
   - Click the delete icon (trash) next to an expense
   - Confirm the deletion
   - The expense will be permanently removed

### Analytics & Insights

1. **Navigate to Analytics**
   - Click "Analytics" in the navigation menu
   - Or use the "View Analytics" quick action on the Dashboard

2. **View Spending Overview**
   - **Total Spending**: See your total expenses for the selected period
   - **Expense Count**: Number of expenses recorded
   - **Average Expense**: Average amount per expense

3. **Category Breakdown**
   - View a pie chart showing spending distribution by category
   - See the percentage and amount for each category
   - Identify which categories consume most of your budget

4. **Monthly Trends**
   - View a line chart showing spending trends over time
   - Track how your spending changes month by month
   - Identify spending patterns and trends

5. **Top Locations**
   - See a bar chart of your top spending locations
   - Identify where you spend the most money
   - Useful for tracking frequent spending locations

6. **Filter Analytics**
   - Use the date range picker to filter analytics
   - Select custom start and end dates
   - View analytics for specific time periods (e.g., this month, last 3 months, this year)

### Tips for Best Experience

- **Regular Updates**: Add expenses regularly to maintain accurate records
- **Detailed Descriptions**: Use clear descriptions to easily identify expenses later
- **Consistent Categories**: Use consistent category names for better analytics
- **Location Tracking**: Add location information to identify spending patterns
- **Review Analytics**: Regularly check analytics to understand your spending habits
- **Date Accuracy**: Ensure dates are accurate for meaningful trend analysis

## 🔌 API Endpoints

The application provides the following REST API endpoints:

### Expenses
- `GET /api/expenses` - Get user expenses with optional filtering (category, date range, search)
- `POST /api/expenses` - Create a new expense
- `PUT /api/expenses/[id]` - Update an existing expense
- `DELETE /api/expenses/[id]` - Delete an expense

### Categories
- `GET /api/categories` - Get all user categories
- `POST /api/categories` - Create a new category
- `PUT /api/categories/[id]` - Update an existing category
- `DELETE /api/categories/[id]` - Delete a category (only if no expenses are linked)

### Analytics
- `GET /api/analytics` - Get spending analytics with optional date range filtering

### Health Check
- `GET /api/health` - Check API health status

**Note:** All endpoints require authentication via NextAuth session.

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. MongoDB Connection Error

**Error:** `MongooseError: Operation timed out` or connection refused

**Solutions:**
- Verify your `MONGODB_URI` in `.env.local` is correct
- Check that your MongoDB Atlas cluster is running
- Ensure your IP address is whitelisted in MongoDB Atlas Network Access
- Verify your database username and password are correct
- Check if your MongoDB Atlas cluster is paused (free tier clusters pause after inactivity)

#### 2. Google OAuth Not Working

**Error:** `OAuthSignin` or redirect URI mismatch

**Solutions:**
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`
- Check that the redirect URI in Google Cloud Console matches exactly:
  - Development: `http://localhost:3000/api/auth/callback/google`
  - Production: `https://your-domain.com/api/auth/callback/google`
- Ensure Google+ API or Google Identity API is enabled in Google Cloud Console
- Check that your OAuth consent screen is properly configured

#### 3. NextAuth Secret Error

**Error:** `NEXTAUTH_SECRET is missing` or session issues

**Solutions:**
- Generate a new secret: `openssl rand -base64 32`
- Add it to `.env.local` as `NEXTAUTH_SECRET`
- Ensure `.env.local` is in the root directory
- Restart the development server after adding the secret

#### 4. Build Errors

**Error:** TypeScript or build errors

**Solutions:**
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version: `node --version` (should be 18+)
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`
- Run `npm run lint` to check for code issues

#### 5. Environment Variables Not Loading

**Error:** Variables showing as undefined

**Solutions:**
- Ensure file is named `.env.local` (not `.env`)
- File must be in the root directory (same level as `package.json`)
- Restart the development server after changing environment variables
- Never commit `.env.local` to version control

#### 6. Port Already in Use

**Error:** `Port 3000 is already in use`

**Solutions:**
- Kill the process using port 3000:
  ```bash
  # macOS/Linux
  lsof -ti:3000 | xargs kill -9
  
  # Or use a different port
  PORT=3001 npm run dev
  ```

#### 7. Categories Cannot Be Deleted

**Error:** Category deletion fails

**Solutions:**
- Categories with linked expenses cannot be deleted
- First, delete or edit all expenses in that category
- Then try deleting the category again

### Getting Help

If you encounter issues not listed here:

1. Check the [GitHub Issues](https://github.com/abhinyaay/expense-tracker/issues) for similar problems
2. Create a new issue with:
   - Description of the problem
   - Steps to reproduce
   - Error messages (if any)
   - Your environment (OS, Node.js version)
3. Ensure you've followed all setup steps correctly

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
