#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚗 3D Car Game - Installation Script');
console.log('=====================================\n');

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
    console.error('❌ Node.js version 16 or higher is required');
    console.error(`   Current version: ${nodeVersion}`);
    process.exit(1);
}

console.log(`✅ Node.js version: ${nodeVersion}`);

// Check if package.json exists
if (!fs.existsSync('package.json')) {
    console.error('❌ package.json not found. Please run this script from the project root directory.');
    process.exit(1);
}

console.log('✅ package.json found');

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
} catch (error) {
    console.error('❌ Failed to install dependencies');
    console.error(error.message);
    process.exit(1);
}

// Create necessary directories
console.log('\n📁 Creating directories...');
const directories = [
    'dist',
    'src/assets',
    'src/assets/models',
    'src/assets/textures',
    'src/assets/sounds'
];

directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
    } else {
        console.log(`✅ Directory exists: ${dir}`);
    }
});

// Create .gitignore if it doesn't exist
if (!fs.existsSync('.gitignore')) {
    const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port
`;

    fs.writeFileSync('.gitignore', gitignoreContent);
    console.log('✅ Created .gitignore');
}

// Create environment file template
if (!fs.existsSync('.env.example')) {
    const envContent = `# Server Configuration
PORT=3000
NODE_ENV=development

# Database (if using external database)
# DATABASE_URL=your_database_url_here

# JWT Secret (for authentication)
JWT_SECRET=your_jwt_secret_here

# CORS Origins
CORS_ORIGIN=http://localhost:3000

# Game Configuration
STARTING_MONEY=100000
MAX_PLAYERS=100
AUTO_SAVE_INTERVAL=30000
`;

    fs.writeFileSync('.env.example', envContent);
    console.log('✅ Created .env.example');
}

// Build the project
console.log('\n🔨 Building project...');
try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Project built successfully');
} catch (error) {
    console.error('❌ Failed to build project');
    console.error(error.message);
    process.exit(1);
}

console.log('\n🎉 Installation completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Start the server: npm start');
console.log('2. Open your browser: http://localhost:3000');
console.log('3. Start playing the 3D Car Game!');
console.log('\n🚗 Enjoy racing and collecting cars!');
