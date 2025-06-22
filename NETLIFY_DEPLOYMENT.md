# Netlify Deployment Instructions

## Prerequisites

1. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
2. **GitHub Repository**: Push your code to a GitHub repository
3. **API Keys**: Have your Firebase and Gemini API keys ready

## Deployment Steps

### 1. Connect to Netlify

1. Log in to your Netlify dashboard
2. Click "New site from Git"
3. Choose GitHub and authorize Netlify
4. Select your repository

### 2. Build Settings

Configure the following build settings:

- **Build command**: `npm run build:netlify`
- **Publish directory**: `dist`
- **Base directory**: (leave empty)

### 3. Environment Variables

Add these environment variables in Netlify dashboard under Site settings > Environment variables:

```
GEMINI_API_KEY=your_gemini_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_APP_ID=your_firebase_app_id_here
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id_here
```

### 4. Custom Build Configuration

The project includes:
- `netlify.toml` - Configuration file for redirects and functions
- `netlify/functions/` - Serverless functions for API endpoints
- `vite.config.netlify.ts` - Vite configuration for Netlify build

### 5. Firebase Configuration

Ensure your Firebase project has:

1. **Authentication enabled** with Email/Password and Google providers
2. **Authorized domains** updated to include your Netlify domain:
   - Go to Firebase Console > Authentication > Settings > Authorized domains
   - Add your Netlify domain (e.g., `your-app-name.netlify.app`)

### 6. Deploy

1. Click "Deploy site" in Netlify
2. Wait for the build to complete
3. Your app will be available at `https://your-app-name.netlify.app`

## Files Structure for Deployment

```
├── netlify.toml                 # Netlify configuration
├── netlify/
│   └── functions/               # Serverless functions
│       ├── users.ts            # User management
│       ├── generate-post.ts    # Post generation
│       └── posts.ts            # Post CRUD operations
├── dist/                       # Build output (created during build)
├── client/                     # Frontend source
└── shared/                     # Shared types and schemas
```

## Important Notes

1. **Serverless Functions**: The backend API is converted to Netlify Functions
2. **CORS**: Functions include CORS headers for browser compatibility
3. **Memory Storage**: Uses in-memory storage (data resets on function cold starts)
4. **Environment Variables**: All secrets must be configured in Netlify dashboard

## Troubleshooting

### Build Errors
- Check that all dependencies are in `package.json`
- Verify environment variables are set correctly
- Check build logs in Netlify dashboard

### API Errors
- Verify Gemini API key is valid
- Check Firebase configuration
- Review function logs in Netlify dashboard

### Authentication Issues
- Ensure Firebase domains are correctly configured
- Check that Firebase API keys are set as environment variables
- Verify Firebase project settings match your environment variables

## Production Considerations

**Important**: The current setup uses in-memory storage that resets when functions restart. For production:

1. **Database**: Replace in-memory storage with a proper database:
   - **Supabase**: Free PostgreSQL with built-in auth
   - **PlanetScale**: Serverless MySQL
   - **MongoDB Atlas**: NoSQL option
   - **Airtable**: Quick setup for small apps

2. **Authentication**: Current Firebase auth is production-ready
3. **Rate Limiting**: Add rate limiting to prevent API abuse
4. **Error Monitoring**: Set up error tracking (e.g., Sentry)
5. **Analytics**: Add user analytics if needed

### Quick Database Migration (Supabase Example)

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Use the provided connection string in your environment variables
4. Replace the in-memory storage with Supabase client calls

## Custom Domain (Optional)

To use a custom domain:

1. Go to Site settings > Domain management
2. Add your custom domain
3. Update Firebase authorized domains to include your custom domain
4. Configure DNS settings as instructed by Netlify