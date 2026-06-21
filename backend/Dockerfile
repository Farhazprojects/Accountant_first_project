# Use current LTS-ready Node.js image
FROM node:22-alpine

# Install system dependencies for Puppeteer and build tools for native modules (like bcrypt)
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      python3 \
      make \
      g++

# Tell Puppeteer to use the installed Chromium instead of downloading its own
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package files first (leveraging Docker cache for faster builds)
COPY package*.json ./

# Install only production dependencies to keep the image lean
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Define the command to run the app
CMD ["node", "src/app.js"]