const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.argv[2] || 8000;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.jsx': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'font/eot'
};

const server = http.createServer((req, res) => {
    let pathname = url.parse(req.url).pathname;
    
    // Default to index.html if no path specified
    if (pathname === '/') {
        pathname = '/src/html/index.html';
    }
    
    // Handle root-level requests by redirecting to appropriate folders
    if (pathname.startsWith('/html/')) {
        pathname = '/src' + pathname;
    }
    if (pathname.startsWith('/css/')) {
        pathname = '/src' + pathname;
    }
    if (pathname.startsWith('/js/')) {
        pathname = '/src' + pathname;
    }
    if (pathname.startsWith('/dashboard/')) {
        pathname = '/src' + pathname;
    }
    if (pathname.startsWith('/assets/')) {
        pathname = pathname; // assets is already in root
    }
    
    // Remove leading slash and construct file path from project root
    const filePath = path.join(__dirname, '..', pathname.slice(1));
    
    // Get file extension for MIME type
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'text/plain';
    
    console.log(`📄 Request: ${req.method} ${pathname}`);
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(`❌ File not found: ${filePath}`);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>404 - File Not Found</title>
                    <style>
                        body { font-family: 'Poppins', Arial, sans-serif; text-align: center; padding: 50px; background: #f8f9fa; }
                        .error { color: #dc3545; font-size: 2rem; margin-bottom: 1rem; }
                        .message { color: #6c757d; margin-bottom: 2rem; }
                        .back-link { display: inline-block; margin: 10px; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 8px; transition: all 0.3s ease; }
                        .back-link:hover { background: #0056b3; transform: translateY(-2px); }
                        .dashboard-links { margin-top: 2rem; }
                    </style>
                </head>
                <body>
                    <h1 class="error">🚫 404 - File Not Found</h1>
                    <p class="message">The requested file <code>${pathname}</code> was not found.</p>
                    <div class="dashboard-links">
                        <a href="/dashboard/html/user-dashboard.html" class="back-link">👤 User Dashboard</a>
                        <a href="/dashboard/html/user-appointments.html" class="back-link">📅 User Appointments</a>
                        <a href="/dashboard/html/user-reminders.html" class="back-link">🔔 User Reminders</a>
                        <a href="/dashboard/html/provider-dashboard.html" class="back-link">👨‍⚕️ Provider Dashboard</a>
                        <a href="/dashboard/html/provider-appointments.html" class="back-link">👨‍⚕️ Provider Appointments</a>
                        <a href="/dashboard/html/provider-reminders.html" class="back-link">🔔 Provider Reminders</a>
                    </div>
                </body>
                </html>
            `);
            return;
        }
        
        // Read and serve the file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(`❌ Error reading file: ${err.message}`);
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>500 - Server Error</title>
                        <style>
                            body { font-family: 'Poppins', Arial, sans-serif; text-align: center; padding: 50px; background: #f8f9fa; }
                            .error { color: #dc3545; font-size: 2rem; }
                            .message { color: #6c757d; margin: 1rem 0; }
                        </style>
                    </head>
                    <body>
                        <h1 class="error">⚠️ 500 - Server Error</h1>
                        <p class="message">Error reading file: ${err.message}</p>
                    </body>
                    </html>
                `);
                return;
            }
            
            // Set CORS headers for development
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
            console.log(`✅ Served: ${pathname} (${contentType})`);
        });
    });
});

server.listen(PORT, () => {
    console.log('');
    console.log('===============================================');
    console.log('   🏥 MediCare+ Dashboard Server Running!');
    console.log('===============================================');
    console.log('');
    console.log(`🌐 Server running at: http://localhost:${PORT}`);
    console.log('');
    console.log('📋 Available dashboards:');
    console.log(`   👤 User Dashboard: http://localhost:${PORT}/dashboard/html/user-dashboard.html`);
    console.log(`   👨‍⚕️ Provider Dashboard: http://localhost:${PORT}/dashboard/html/provider-dashboard.html`);
    console.log(`   🔗 Test Connection: http://localhost:${PORT}/dashboard/html/test-database-connection.html`);
    console.log('');
    console.log('📅 Appointment & Reminder Pages:');
    console.log(`   👤 User Appointments: http://localhost:${PORT}/dashboard/html/user-appointments.html`);
    console.log(`   🔔 User Reminders: http://localhost:${PORT}/dashboard/html/user-reminders.html`);
    console.log(`   👨‍⚕️ Provider Appointments: http://localhost:${PORT}/dashboard/html/provider-appointments.html`);
    console.log(`   🔔 Provider Reminders: http://localhost:${PORT}/dashboard/html/provider-reminders.html`);
    console.log('');
    console.log('🎯 Dashboard Components:');
    console.log(`   📱 React Components: http://localhost:${PORT}/dashboard/components/`);
    console.log(`   🎨 Dashboard CSS: http://localhost:${PORT}/dashboard/css/`);
    console.log(`   ⚡ Dashboard JS: http://localhost:${PORT}/dashboard/js/`);
    console.log('');
    console.log('🤖 AI Features:');
    console.log('   ✅ DeepSeek AI Symptom Checker');
    console.log('   ✅ Real-time Health Insights');
    console.log('   ✅ Smart Medication Reminders');
    console.log('');
    console.log('🗄️ Database:');
    console.log('   ✅ Supabase Real-time Integration');
    console.log('   ✅ Live Data Synchronization');
    console.log('   ✅ Secure User Authentication');
    console.log('');
    console.log('💡 Tip: Press Ctrl+C to stop the server');
    console.log('');
});

// Handle server errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use!`);
        console.log('💡 Try using a different port:');
        console.log(`   node scripts/server.js ${parseInt(PORT) + 1}`);
        process.exit(1);
    } else {
        console.error('❌ Server error:', err);
        process.exit(1);
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n');
    console.log('🛑 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped successfully');
        process.exit(0);
    });
}); 