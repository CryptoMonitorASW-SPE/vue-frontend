# Stage 1: Build the Vue.js application
FROM node:22.13-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY app/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY app/ .

# Build the application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable AS prod-stage

# Remove default Nginx website
#RUN rm -rf /usr/share/nginx/html/*

# Copy the built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

COPY ./entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

# Expose port 80
EXPOSE 80

COPY ./nginx.conf /etc/nginx/conf.d/nginx.conf.template

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]