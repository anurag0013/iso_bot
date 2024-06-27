FROM node:18-bookworm

# Set src/app as work directory
WORKDIR src/app

# Copy All project files
COPY . .

# Update python & remove apk cache
RUN apt-get update -y
RUN apt-get install -y python3 make g++
RUN npm cache clean --force  

# Build
RUN npm install -S node-gyp
#RUN npm install -S chromadb
RUN npm install
RUN npm run build

# Expose & Set ENV port to 3002 && 5001 for socket
EXPOSE 3002
EXPOSE 5001

# Serve the build
CMD ["npm", "run", "start:prod"]
