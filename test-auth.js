/**
 * Authentication Test Script
 * 
 * This script tests the authentication flow with the simple-auth service
 * to ensure everything is working correctly after migration.
 */

const AUTH_API_BASE_URL = 'https://simple-auth-service.vercel.app/api';
const FOOD_DELIVERY_APP_URL = 'https://food-delivery-app-frontend.vercel.app';

// Test user data
const testUser = {
  name: 'Test User',
  email: 'testuser@example.com',
  password: 'TestPassword123!',
};

/**
 * Test user registration
 */
async function testRegistration() {
  console.log('🔄 Testing user registration...');
  
  try {
    const response = await fetch(`${AUTH_API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
        appName: FOOD_DELIVERY_APP_URL,
        role: 'user',
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Registration successful');
      console.log('📋 User data:', {
        id: data.data.user.id,
        name: data.data.user.name,
        email: data.data.user.email,
        role: data.data.user.role,
        appRegistered: data.data.user.appRegistered,
      });
      return data.data.tokens;
    } else {
      console.log('❌ Registration failed:', data.error);
      console.log('📋 Full response:', JSON.stringify(data, null, 2));
      return null;
    }
  } catch (error) {
    console.error('❌ Registration error:', error);
    return null;
  }
}

/**
 * Test user login
 */
async function testLogin() {
  console.log('🔄 Testing user login...');
  
  try {
    const response = await fetch(`${AUTH_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
        appEndpoint: FOOD_DELIVERY_APP_URL,
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Login successful');
      console.log('📋 User data:', {
        id: data.data.user.id,
        name: data.data.user.name,
        email: data.data.user.email,
        role: data.data.user.role,
        appEndpoint: data.data.user.appEndpoint,
      });
      return data.data.tokens;
    } else {
      console.log('❌ Login failed:', data.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    return null;
  }
}

/**
 * Test token refresh
 */
async function testTokenRefresh(refreshToken) {
  console.log('🔄 Testing token refresh...');
  
  try {
    const response = await fetch(`${AUTH_API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: refreshToken,
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Token refresh successful');
      return data.data.tokens;
    } else {
      console.log('❌ Token refresh failed:', data.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Token refresh error:', error);
    return null;
  }
}

/**
 * Test user profile access
 */
async function testUserProfile(accessToken) {
  console.log('🔄 Testing user profile access...');
  
  try {
    const response = await fetch(`${AUTH_API_BASE_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Profile access successful');
      console.log('📋 Profile data:', {
        id: data.data.user.id,
        name: data.data.user.name,
        email: data.data.user.email,
        emailVerified: data.data.user.emailVerified,
        appRegistered: data.data.user.appRegistered,
      });
      return true;
    } else {
      console.log('❌ Profile access failed:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Profile access error:', error);
    return false;
  }
}

/**
 * Test logout
 */
async function testLogout(accessToken, refreshToken) {
  console.log('🔄 Testing logout...');
  
  try {
    const response = await fetch(`${AUTH_API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        refreshToken: refreshToken,
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Logout successful');
      return true;
    } else {
      console.log('❌ Logout failed:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Logout error:', error);
    return false;
  }
}

/**
 * Main test function
 */
async function runAuthTests() {
  console.log('🚀 Starting authentication tests...\n');
  
  let tokens = null;
  
  // Test 1: Registration
  tokens = await testRegistration();
  if (!tokens) {
    console.log('⚠️ Registration failed, trying login instead...');
    tokens = await testLogin();
  }
  
  if (!tokens) {
    console.log('❌ Both registration and login failed. Exiting tests.');
    return;
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 2: User Profile Access
  await testUserProfile(tokens.accessToken);
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 3: Token Refresh
  const newTokens = await testTokenRefresh(tokens.refreshToken);
  if (newTokens) {
    tokens = newTokens;
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 4: Logout
  await testLogout(tokens.accessToken, tokens.refreshToken);
  
  console.log('\n🎉 Authentication tests completed!');
}

// Run tests
runAuthTests().catch(console.error);
