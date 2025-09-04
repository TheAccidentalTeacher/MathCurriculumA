#!/bin/bash

# Railway Build Script
# This script ensures proper environment setup during Railway deployment

echo "🚀 Starting Railway build process..."

# Check if we're in Railway environment
if [ "$RAILWAY_ENVIRONMENT" != "" ]; then
    echo "📡 Railway environment detected: $RAILWAY_ENVIRONMENT"
    
    # Generate Prisma client for Railway
    echo "🔧 Generating Prisma client..."
    npx prisma generate
    
    # Build the Next.js app
    echo "📦 Building Next.js application..."
    npx next build
else
    echo "💻 Local development environment detected"
    # Standard build for local development
    npm run build
fi

echo "✅ Build completed successfully!"
