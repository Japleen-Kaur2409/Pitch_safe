# Node frontend
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy frontend code
COPY . .

# Expose port (default Vite/React)
EXPOSE 5173

# Start frontend dev server
CMD ["npm", "run", "dev"]
