#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚗 Starting 3D Car Game...\n');

// Start the server
console.log('🔧 Starting server...');
const server = spawn('node', ['server.js'], {
    stdio: 'inherit',
    cwd: __dirname
});

server.on('error', (error) => {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
});

server.on('close', (code) => {
    console.log(`\n🔧 Server exited with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down...');
    server.kill('SIGINT');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down...');
    server.kill('SIGTERM');
    process.exit(0);
});

console.log('✅ Server started successfully!');
console.log('🌐 Open your browser and go to: http://localhost:3000');
console.log('🎮 Enjoy playing the 3D Car Game!');
console.log('\nPress Ctrl+C to stop the server.');
