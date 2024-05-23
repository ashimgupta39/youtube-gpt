# Use an official Node.js runtime as the base image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire React app
COPY . .

# Build the React app
RUN npm run build

# Expose the port and start the app
EXPOSE 3000
CMD ["npm", "start"]