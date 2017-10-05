FROM tlodge/databox-datasource-mock-base

WORKDIR /usr/src/app

# Install app dependencies
ADD data data
COPY build/bundle.js index.js

EXPOSE 8080