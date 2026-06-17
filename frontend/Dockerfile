# STAGE 1: Build the React Application
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy source code and build for production
COPY . .
# Pass in the production API URL during build time
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# STAGE 2: Serve the App with Nginx
FROM nginx:alpine

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the compiled React build from Stage 1
COPY --from=build /app/build /usr/share/nginx/html

# Copy our custom Nginx routing configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]