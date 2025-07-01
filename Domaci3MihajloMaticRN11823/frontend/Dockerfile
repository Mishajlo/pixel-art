FROM node:16

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire project
COPY . .

# Expose the frontend server port
EXPOSE 3000

# Start the Express server for serving static files
CMD ["node", "server.ts"]