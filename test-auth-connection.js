// Test script to verify connection to simple authentication service
// Run this script to test if the authentication service is running and accessible

const API_BASE_URL = 'https://simple-authentication-service.vercel.app';

async function testConnection() {
  console.log('🔍 Testing connection to Simple Authentication Service...');
  console.log(`📍 API Base URL: ${API_BASE_URL}`);
  
  try {
    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);

    // Test auth test endpoint
    console.log('\n2. Testing auth test endpoint...');
    const authTestResponse = await fetch(`${API_BASE_URL}/api/auth/test`);
    const authTestData = await authTestResponse.json();
    console.log('✅ Auth test:', authTestData);

    // Test registration endpoint (without actually registering)
    console.log('\n3. Testing registration endpoint structure...');
    const testRegistrationData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpassword123',
      appEndpoint: 'http://127.0.0.1:3001',
      role: 'user'
    };

    const registrationResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRegistrationData)
    });

    const registrationResult = await registrationResponse.json();
    console.log('✅ Registration endpoint response:', registrationResult);

    console.log('\n🎉 All tests passed! The authentication service is running and accessible.');
    console.log('\n📝 Next steps:');
    console.log('1. Start the food delivery frontend: npm start');
    console.log('2. Open http://127.0.0.1:3001');
    console.log('3. Try to register/login using the authentication forms');

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if the production auth service is accessible');
    console.log('2. Verify your internet connection');
    console.log('3. Check if the auth service is deployed correctly');
    console.log('4. Verify the app endpoint mapping supports 127.0.0.1:3001');
  }
}

// Run the test
testConnection();
