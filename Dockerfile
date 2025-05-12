FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Make sure the src/app directory exists for Next.js
RUN mkdir -p src/app

EXPOSE 3000

CMD ["npm", "run", "dev"]