# Use an official Node.js runtime as a parent image
FROM node:18.17.0

WORKDIR /usr/src/app

# Install Google Chrome Stable and fonts
RUN apt-get update \
 && apt-get install -y chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium

# Install the Node.js application dependencies
RUN npm install

# Copy the rest of your application's source code to the container
COPY . .

RUN npm run build
# Define the command to run your Node.js application
CMD [ "node", "dist/index.js" ]
