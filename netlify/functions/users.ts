import { Handler } from '@netlify/functions';
import { insertUserSchema } from '../../shared/schema';

// Simple in-memory storage for Netlify functions (shared across function calls)
declare global {
  var netlifyUsers: any[];
  var netlifyCurrentUserId: number;
}

if (!global.netlifyUsers) {
  global.netlifyUsers = [];
  global.netlifyCurrentUserId = 1;
}

export const handler: Handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-firebase-uid',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    const validatedData = insertUserSchema.parse(JSON.parse(event.body || '{}'));
    
    // Check if user already exists
    let user = global.netlifyUsers.find(u => u.firebaseUid === validatedData.firebaseUid);
    
    if (!user) {
      // Create new user
      user = {
        id: global.netlifyCurrentUserId++,
        firebaseUid: validatedData.firebaseUid,
        email: validatedData.email,
        displayName: validatedData.displayName || null,
        createdAt: new Date().toISOString(),
      };
      global.netlifyUsers.push(user);
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(user),
    };
  } catch (error: any) {
    console.error('Error creating/getting user:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: error.message || 'Failed to create/get user' 
      }),
    };
  }
};