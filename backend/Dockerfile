# Node backend
FROM node:20-alpine

WORKDIR /app

# Copy only package files first
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Copy backend code
COPY . .

# Expose port
EXPOSE 5001

# Start backend server
CMD ["npm", "run", "dev"]
