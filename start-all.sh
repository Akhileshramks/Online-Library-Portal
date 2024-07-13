#!/bin/bash

# Function to start the Rails server
start_rails() {
  echo "Starting Rails server..."
  cd Authenticate-rails
  rails s &
  cd ..
}

# Function to start the Go service
start_go() {
  echo "Starting Go service..."
  cd Book-go 
  go run main.go &
  cd ..
}

# Function to start the React app
start_react() {
  echo "Starting React app..."
  cd page-react
  npm start &
  cd ..
}

# Start all services
start_rails
start_go
start_react

echo "All services started."

