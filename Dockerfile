# Use an official Node.js runtime as a base image
FROM node:20

RUN apt-get update && apt-get install -y \
    libnss3 \
    libxss1 \
    libasound2 \
    fonts-noto-color-emoji \
    libdbus-1-3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxcomposite1 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libxkbcommon0 \
    libx11-xcb1 \
    libxshmfence1 \
    libgbm-dev \
    libglib2.0-0 \
    libgtk-3-0 \
    libgdk-pixbuf2.0-0 \
    libpango1.0-0 \
    libharfbuzz0b \
    libfontconfig1 \
    libjpeg62-turbo \
    libpng16-16 \
    libfreetype6 \
    libxtst6 \
    libxrender1 \
    libx11-6 \
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
