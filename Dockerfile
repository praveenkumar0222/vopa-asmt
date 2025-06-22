# Use an official Node.js runtime as a parent image
FROM node:20-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json to the working directory
COPY package.json ./

# Install dependencies
#RUN npm install

RUN npm install --legacy-peer-deps

RUN npm install ajv@^8.12.0 ajv-keywords@^5.1.0 --save
# Copy the rest of your app's source code from your host to your image filesystem
COPY . .

# Build the app
RUN npm run build

# Install PM2 globally
RUN npm install pm2 -g

# Expose the port Next.js runs on
EXPOSE 3003

# Command to run the app using PM2
CMD ["pm2-runtime", "ecosystem.config.js"]
