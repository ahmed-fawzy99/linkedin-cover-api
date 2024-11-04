# Use an official Node.js runtime as a base image
FROM node:20

RUN apt-get update && apt-get install -y \
    libnss3 \
    libxss1 \
    libasound2 \
    fonts-noto-color-emoji \
    && rm -rf /var/lib/apt/lists/*


# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port that the app will run on
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
