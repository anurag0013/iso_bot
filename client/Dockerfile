# Pull from node alpine docker image,use current alpine version
FROM node:current-alpine

# Set src/app as work directory
WORKDIR src/app

# Copy All project files
COPY . .

# Build
RUN yarn install
RUN yarn build

# Expose & Set ENV port to 3001
EXPOSE 3001
ENV PORT 3001

# Serve the build
CMD ["yarn", "start"]
