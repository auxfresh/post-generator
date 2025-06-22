import { Handler } from '@netlify/functions';
import { insertPostSchema } from '../../shared/schema';

// Simple in-memory storage for Netlify functions (shared across function calls)
declare global {
  var netlifyPosts: any[];
  var netlifyUsers: any[];
  var netlifyCurrentPostId: number;
  var netlifyCurrentUserId: number;
}

if (!global.netlifyPosts) {
  global.netlifyPosts = [];
}
if (!global.netlifyUsers) {
  global.netlifyUsers = [];
}
if (!global.netlifyCurrentPostId) {
  global.netlifyCurrentPostId = 1;
}
if (!global.netlifyCurrentUserId) {
  global.netlifyCurrentUserId = 1;
}

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-firebase-uid',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  const firebaseUid = event.headers['x-firebase-uid'];
  if (!firebaseUid) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ message: 'Authentication required' }),
    };
  }

  let user = global.netlifyUsers.find(u => u.firebaseUid === firebaseUid);
  if (!user) {
    // Create user if it doesn't exist
    if (!global.netlifyCurrentUserId) {
      global.netlifyCurrentUserId = 1;
    }
    user = {
      id: global.netlifyCurrentUserId++,
      firebaseUid: firebaseUid,
      email: `user-${firebaseUid}@example.com`, // Fallback email
      displayName: null,
      createdAt: new Date().toISOString(),
    };
    global.netlifyUsers.push(user);
  }

  try {
    if (event.httpMethod === 'GET') {
      // Get user posts
      const userPosts = global.netlifyPosts
        .filter(post => post.userId === user.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(userPosts),
      };
    }

    if (event.httpMethod === 'POST') {
      // Create new post
      const validatedData = insertPostSchema.parse({
        ...JSON.parse(event.body || '{}'),
        userId: user.id,
      });
      
      const post = {
        id: global.netlifyCurrentPostId++,
        userId: user.id,
        content: validatedData.content,
        platform: validatedData.platform,
        tone: validatedData.tone,
        idea: validatedData.idea || null,
        hasEmojis: validatedData.hasEmojis ?? false,
        hasHashtags: validatedData.hasHashtags ?? false,
        hasSuggestedImages: validatedData.hasSuggestedImages ?? false,
        createdAt: new Date().toISOString(),
      };
      
      global.netlifyPosts.push(post);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(post),
      };
    }

    if (event.httpMethod === 'DELETE') {
      // Delete post
      const postId = parseInt(event.path.split('/').pop() || '');
      if (isNaN(postId)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Invalid post ID' }),
        };
      }

      const postIndex = global.netlifyPosts.findIndex(p => p.id === postId && p.userId === user.id);
      if (postIndex === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Post not found' }),
        };
      }

      global.netlifyPosts.splice(postIndex, 1);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Post deleted successfully' }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  } catch (error: any) {
    console.error('Error handling posts:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: error.message || 'Failed to handle request' 
      }),
    };
  }
};
