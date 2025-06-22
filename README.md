# AI Post Generator

A modern, responsive web application that uses AI to generate engaging social media posts for multiple platforms.

![AI Post Generator](client/public/logo.svg)

## Features

- **AI-Powered Content Generation** - Uses Gemini AI to create engaging posts
- **Multi-Platform Support** - Generate content for Twitter, LinkedIn, Facebook, Instagram, and Threads
- **Customizable Tones** - Choose from friendly, professional, funny, bold, inspiring, or casual tones
- **Firebase Authentication** - Secure login with email/password and Google sign-in
- **Post History** - Save and manage your generated posts
- **Responsive Design** - Works perfectly on mobile and desktop
- **Real-time Generation** - Fast AI-powered content creation

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Radix UI components
- TanStack Query for API state management
- Wouter for routing
- Firebase Authentication

### Backend
- Express.js server
- Firebase Authentication integration
- Gemini AI API integration
- In-memory storage (upgradeable to database)

### Deployment
- Netlify ready with serverless functions
- Vite for fast development and building

## Getting Started

### Prerequisites
- Node.js 18+ 
- Firebase project
- Gemini API key

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd ai-post-generator
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create these environment variables in your Replit secrets or `.env` file:
```
GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
```

4. Configure Firebase
- Create a Firebase project
- Enable Authentication with Email/Password and Google providers
- Add your domain to Firebase authorized domains

5. Run the development server
```bash
npm run dev
```

## Deployment

### Netlify Deployment

The project is ready for Netlify deployment with serverless functions:

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Configure build settings:
   - Build command: `npm run build:netlify`
   - Publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy

See `NETLIFY_DEPLOYMENT.md` for detailed deployment instructions.

## Project Structure

```
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/          # Utilities and configurations
│   │   └── pages/        # Route pages
│   └── public/           # Static assets
├── server/                # Backend application
│   ├── services/         # Business logic
│   └── routes.ts         # API routes
├── netlify/              # Netlify serverless functions
│   └── functions/        # API endpoints for deployment
├── shared/               # Shared types and schemas
└── docs/                 # Documentation
```

## API Endpoints

- `POST /api/users` - Create or get user
- `POST /api/generate-post` - Generate AI content
- `GET /api/posts` - Get user posts
- `POST /api/posts` - Save generated post
- `DELETE /api/posts/:id` - Delete post

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support or questions, please open an issue on GitHub.