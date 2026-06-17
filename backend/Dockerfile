# Use the official, lightweight Node.js image
FROM node:18-alpine

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