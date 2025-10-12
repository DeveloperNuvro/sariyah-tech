// Temporary script to fix progress calculation
// Run this with: node fix-progress.js

const axios = require('axios');

const API_BASE = 'http://localhost:8900/api';

// You'll need to replace these with actual values
const INSTRUCTOR_TOKEN = 'YOUR_INSTRUCTOR_TOKEN_HERE'; // Get this from browser dev tools
const COURSE_ID = 'YOUR_COURSE_ID_HERE'; // Get this from the URL or database

async function fixProgress() {
  try {
    console.log('🔧 Fixing progress calculation...');
    
    const response = await axios.post(
      `${API_BASE}/progress/recalculate/${COURSE_ID}`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${INSTRUCTOR_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Success:', response.data.message);
    console.log('📊 Data:', response.data.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data?.message || error.message);
  }
}

// Instructions
console.log(`
🔧 Progress Fix Script
=====================

To use this script:

1. Get your instructor token:
   - Open browser dev tools (F12)
   - Go to Application/Storage → Local Storage
   - Find 'token' and copy the value

2. Get your course ID:
   - Go to instructor dashboard
   - Copy the course ID from the URL or database

3. Replace the values in this script and run:
   node fix-progress.js

Or use the web interface:
- Go to Instructor Dashboard
- Click the yellow "🔧 Fix All Progress" button
`);

// Uncomment the line below after setting the values
// fixProgress();
