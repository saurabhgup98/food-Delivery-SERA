#!/bin/bash

# Force production deployment
echo "Deploying to production..."

# Build the project
npm run build

# Deploy to Vercel production
vercel --prod

echo "Deployment complete!"
