# ------------------------------------------
# Stage 1: Build the React Application
# ------------------------------------------
FROM node:18 AS build

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all project files and build the React app
COPY . .
RUN npm run build

# ------------------------------------------
# Stage 2: Serve the Build with NGINX
# ------------------------------------------
FROM nginx:1.25-alpine

# Copy build output from previous stage to NGINX HTML directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for the web server
EXPOSE 80

# Start NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
