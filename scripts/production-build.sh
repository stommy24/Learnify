#!/bin/bash
set -e

echo "🚀 Starting production build process..."

# Run type checking
echo "Running type check..."
npm run type-check

# Run tests
echo "Running tests..."
npm run test

# Run security audit
echo "Running security audit..."
npm audit

# Build application
echo "Building application..."
npm run build

# Run production checks
echo "Running production checks..."
node scripts/prod-checks.js

# Generate deployment artifacts
echo "Generating deployment artifacts..."
npm run generate-deployment-artifacts

echo "✅ Production build completed successfully" 