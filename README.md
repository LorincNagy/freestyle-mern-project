# Learning Project
## Overview
This project is built on the MERN (MongoDB, Express, React, Node.js) stack and is designed to efficiently manage movie data. It provides a search feature using a third-party API that allows you to browse and search for movies.

# Technology Stack
## Frontend:
JavaScript/ES6
React
HTML/CSS
## Backend:
Node.js
Express.js
MongoDB
Mongoose
This project demonstrates the use of the MERN stack for efficient movie searching.

## Server side
### Install Dependencies
cd ./server
npm install

# Prepare the Database
cd ./server
.env File
Copy the .env.sample as .env and fill in the environment variables with your personal MongoDB connection URL.

# Running the Code
cd ./server
npm start
It will start the node server.
npm run dev
It will start the server with nodemon, so it will watch for changes and restart the server if any of the files change.


# Client side
## Install Dependencies
cd ./client
npm install
Proxy
Pay attention to the port of your REST API. By default, it will bind to port 8080, and the frontend proxy settings depend on this configuration. If you change the port of the backend for any reason, don't forget to update the proxy settings in ./client/package.json accordingly.

## Running the Code
cd ./client
npm start
The create-react-app react-scripts package will start your frontend on port 3000, and you can access it at http://localhost:3000 in your preferred browser.


