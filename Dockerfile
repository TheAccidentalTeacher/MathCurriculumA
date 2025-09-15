# Simplified Docker build optimized for Railway
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

# Build the application
RUN npm run build

# Clean up dev dependencies to reduce image size
RUN npm prune --production

# Expose port
EXPOSE 3000

ENV NODE_ENV production
ENV PORT 3000

# Start the application
CMD ["npm", "start"]