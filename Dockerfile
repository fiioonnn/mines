FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Set environment variable for database
ENV DATABASE_URL="file:./prisma/dev.db"

# Generate Prisma client
RUN npx prisma generate

# Push the database schema
RUN npx prisma db push

# Seed the database
RUN npm run db:seed

# Expose the port
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
