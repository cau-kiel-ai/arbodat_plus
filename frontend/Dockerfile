# Stage 1: Build SCSS to CSS using npm and dart-sass
FROM node:16 AS build-stage

# Set the working directory
WORKDIR /app

# Copy the SCSS files into the container
COPY ./sass ./sass
COPY ./bootstrap-scss ./bootstrap-scss

RUN find ./sass -name "*.scss" -exec sh -c 'mv "$1" "${1%.scss}.min.scss"' _ {} \;

# Install dart-sass globally
RUN npm install -g sass@1.62.1

# Compile SCSS to CSS
RUN sass --style=compressed ./sass:./css 

# Stage 2: Serve files with nginx
FROM nginx AS production-stage

# Copy compiled CSS files and other necessary files into nginx's web root
COPY . /usr/share/nginx/html
COPY --from=build-stage /app/css /usr/share/nginx/html/css