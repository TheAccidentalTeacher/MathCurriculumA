[Region: us-west1]
=========================
Using Detected Dockerfile
=========================

context: qrn9-p5HL

internal
load build definition from Dockerfile
0ms

internal
load metadata for docker.io/library/node:20-alpine
997ms

auth
library/node:pull token for registry-1.docker.io
0ms

internal
load .dockerignore
0ms

[ 1/10] FROM docker.io/library/node:20-alpine@sha256:eabac870db94f7342d6c33560d6613f188bbcf4bbe1f4eb47d5e2a08e1a37722
6ms

internal
load build context
0ms

[ 2/10] WORKDIR /app
137ms

[ 3/10] RUN apk add --no-cache     python3     make     g++     sqlite
2s
OK: 272 MiB in 48 packages

[ 4/10] COPY package*.json ./
319ms

[ 5/10] COPY prisma/ ./prisma/
11ms

[ 6/10] RUN npm ci --prefer-offline --no-audit --no-fund
20s
npm notice

[ 7/10] COPY . .
2s

[ 8/10] RUN cp curriculum_precise.db ./ || cp prisma/curriculum.db ./curriculum.db || true
195ms
cp: 'curriculum_precise.db' and './curriculum_precise.db' are the same file

[ 9/10] RUN npm run build
51s
> math-curriculum-app@1.0.5 build
> prisma generate && next build
Prisma schema loaded from prisma/schema.prisma
✔ Generated Prisma Client (v6.15.0) to ./node_modules/@prisma/client in 150ms
Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
Tip: Want to turn off tips and other hints? https://pris.ly/tip-4-nohints
Attention: Next.js now collects completely anonymous telemetry regarding usage.
This information is used to shape Next.js' roadmap and prioritize features.
You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
https://nextjs.org/telemetry
   ▲ Next.js 15.5.2
   - Experiments (use with caution):
     · optimizePackageImports
   Creating an optimized production build ...
 ✓ Compiled successfully in 45s
   Skipping validation of types
   Skipping linting
   Collecting page data ...
Error: The OPENAI_API_KEY environment variable is missing or empty; either provide it, or instantiate the OpenAI client with an apiKey option, like new OpenAI({ apiKey: 'My API Key' }).

    at new c7 (.next/server/chunks/1334.js:8:43611)
    at <static_initializer> (.next/server/chunks/2677.js:1:4900)
    at 46129 (.next/server/chunks/2677.js:1:4717)
    at c (.next/server/webpack-runtime.js:1:128)
    at 75997 (.next/server/app/api/cache/status/route.js:1:1147)
    at c (.next/server/webpack-runtime.js:1:128)
    at <unknown> (.next/server/app/api/cache/status/route.js:1:8341)
    at c.X (.next/server/webpack-runtime.js:1:1206)
    at <unknown> (.next/server/app/api/cache/status/route.js:1:8311)
    at Object.<anonymous> (.next/server/app/api/cache/status/route.js:1:8373)
Error: The OPENAI_API_KEY environment variable is missing or empty; either provide it, or instantiate the OpenAI client with an apiKey option, like new OpenAI({ apiKey: 'My API Key' }).

    at new c7 (.next/server/chunks/1334.js:8:43611)
    at <static_initializer> (.next/server/chunks/2677.js:1:4900)
    at 46129 (.next/server/chunks/2677.js:1:4717)
    at c (.next/server/webpack-runtime.js:1:128)
    at 30506 (.next/server/app/api/lessons/[documentId]/[lessonNumber]/kid-friendly-questions/route.js:1:912)
    at c (.next/server/webpack-runtime.js:1:128)
    at <unknown> (.next/server/app/api/lessons/[documentId]/[lessonNumber]/kid-friendly-questions/route.js:1:8043)
    at c.X (.next/server/webpack-runtime.js:1:1206)
    at <unknown> (.next/server/app/api/lessons/[documentId]/[lessonNumber]/kid-friendly-questions/route.js:1:8013)
    at Object.<anonymous> (.next/server/app/api/lessons/[documentId]/[lessonNumber]/kid-friendly-questions/route.js:1:8075)
Error: The OPENAI_API_KEY environment variable is missing or empty; either provide it, or instantiate the OpenAI client with an apiKey option, like new OpenAI({ apiKey: 'My API Key' }).

    at new c7 (.next/server/chunks/1334.js:8:43611)
    at <static_initializer> (.next/server/chunks/2677.js:1:4900)
    at 46129 (.next/server/chunks/2677.js:1:4717)
    at c (.next/server/webpack-runtime.js:1:128)
    at 6034 (.next/server/app/api/lessons/[documentId]/[lessonNumber]/prepare/route.js:1:615)
    at c (.next/server/webpack-runtime.js:1:128)
    at <unknown> (.next/server/app/api/lessons/[documentId]/[lessonNumber]/prepare/route.js:1:8635)
    at c.X (.next/server/webpack-runtime.js:1:1206)
    at <unknown> (.next/server/app/api/lessons/[documentId]/[lessonNumber]/prepare/route.js:1:8605)
    at Object.<anonymous> (.next/server/app/api/lessons/[documentId]/[lessonNumber]/prepare/route.js:1:8666)
> Build error occurred
[Error: Failed to collect page data for /api/cache/status] {
  type: 'Error'
}
Dockerfile:27
-------------------
25 |
26 |     # Build the application
27 | >>> RUN npm run build
28 |
29 |     # Clean up dev dependencies to reduce image size
-------------------
ERROR: failed to build: failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1# Simplified Docker build optimized for Railway
FROM node:20-alpine

WORKDIR /app

# Install system dependencies needed for better-sqlite3
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    sqlite

# Copy package files and prisma schema first
COPY package*.json ./
COPY prisma/ ./prisma/

# Install ALL dependencies (including dev) for build
RUN npm ci --prefer-offline --no-audit --no-fund

# Copy source code
COPY . .

# Copy database file
RUN cp curriculum_precise.db ./ || cp prisma/curriculum.db ./curriculum.db || true

# Set a dummy OPENAI_API_KEY for build time (Next.js tries to pre-render API routes)
ENV OPENAI_API_KEY="dummy-key-for-build"

# Build the application
RUN npm run build

# Remove the dummy key
ENV OPENAI_API_KEY=""

# Clean up dev dependencies to reduce image size
RUN npm prune --production

# Expose port
EXPOSE 3000

ENV NODE_ENV production
ENV PORT 3000

# Start the application
CMD ["npm", "start"]