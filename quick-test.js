const axios = require('axios');

console.log('🏥 Quick Medicare AI System Test...\n');

async function runQuickTest() {
    try {
        // Test 1: Server Health
        console.log('1. Testing server...');
        try {
            const response = await axios.get('http://localhost:8000/');
            console.log('   ✅ Server is running');
        } catch (error) {
            console.log('   ❌ Server not responding');
            return;
        }

        // Test 2: AI Chat
        console.log('2. Testing AI Chat...');
        try {
            const response = await axios.post('http://localhost:8000/api/ai-chat', {
                message: 'Hello, test message'
            });
            
            if (response.data.success) {
                console.log('   ✅ AI Chat working (fallback mode)');
                console.log(`   📝 Response: ${response.data.response.substring(0, 100)}...`);
            } else {
                console.log('   ⚠️  AI Chat has issues');
            }
        } catch (error) {
            console.log('   ❌ AI Chat failed:', error.message);
        }

        // Test 3: Health Document Processing
        console.log('3. Testing Health Document API...');
        try {
            const response = await axios.get('http://localhost:8000/html/health-documents.html');
            console.log('   ✅ Health Document UI accessible');
        } catch (error) {
            console.log('   ❌ Health Document UI failed');
        }

        // Test 4: ML API
        console.log('4. Testing ML API...');
        try {
            const response = await axios.post('http://localhost:8000/api/ml/predict-health-risk', {
                age: 45,
                gender: 'male',
                symptoms: ['fatigue']
            });
            console.log('   ✅ ML API working');
        } catch (error) {
            console.log('   ❌ ML API failed');
        }

        console.log('\n🎉 Quick test complete!');
        console.log('\n💡 Next steps:');
        console.log('   1. Open http://localhost:8000 in your browser');
        console.log('   2. Test the AI chat interface');
        console.log('   3. Try uploading health documents');
        console.log('   4. To enable full AI features: Get DeepSeek API key and update .env file');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

runQuickTest(); 