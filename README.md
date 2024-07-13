# Online Library Portal

The Online Library Portal is designed to allow users to manage and borrow books. The system includes various roles with specific permissions, and users interact through a web portal.

## Features

### User Roles and Permissions

#### Admin
- Create/update/delete books.
- Manage library staff (librarians).
- View all books and borrowing records.

#### Librarian
- Add/update/delete books.
- Manage borrowing records.

#### Member
- Search and view books.
- Borrow and return books.
- View their borrowing history.

### Core Features

#### Book Management
- Admins and Librarians can create, update, and delete books.
- Books have details like title, author, publication date, genre, and availability status.

#### User Management
- Admins can manage library staff.
- Users can register and log in to the portal.

#### Borrowing System
- Members can borrow available books.
- Members can return borrowed books.
- Borrowing history is maintained for each member.
- Number of books available is included in the UI.

## Technical Requirements

### Backend
- **User Service**: Written in ROR, handles user authentication and authorization.
- **Library Service**: Written in GO, handles book management and borrowing system.
- **Database**: MySQL for relational data (users, books, borrowing records), MongoDB for logging.

### Frontend
- Implemented in React.js with Material UI.
- Responsive design for different device sizes.
- Interactive UI for book searching, borrowing, and returning.

## How to Run the Project

### Prerequisites
- Node.js and npm
- Ruby and Rails
- Go
- MySQL
- MongoDB

### Setup Instructions

1. **Clone the Repository**

    ```sh
    git clone https://github.com/Akhileshramks/Online-Library-Portal.git
    cd Online-Library-Portal
    ```

2. **Make the Script Executable**

    ```sh
    chmod +x start-all.sh
    ```

3. **Start All Servers**

    ```sh
    ./start-all.sh
    ```

    This script will:
    - Start the Rails server for the user service on port 3001.
    - Start the Go server for the library service on port 3002.
    - Start the React server for the frontend on port 3000.

### Manual Steps

If you prefer to start each server manually, follow these steps:

1. **Start the Rails Server**

    ```sh
    cd Authenticate-rails
    bundle install
    rails db:create db:migrate
    rails server -p 3001
    ```

2. **Start the Go Server**

    ```sh
    cd ../Book-go
    go run main.go
    ```

3. **Start the React Server**

    ```sh
    cd ../page-react
    npm install
    npm start
    ```

### Note
Ensure that MySQL and MongoDB are running before starting the servers. Configure the database connections as needed in the respective configuration files.

## Project Overview
The Online Library Portal is a comprehensive system designed to facilitate book management and borrowing processes. It leverages modern web technologies and adheres to industry best practices to ensure a robust and user-friendly experience.

## Conclusion
This project successfully creates a functional and user-friendly online library portal with clearly defined roles and permissions, a robust backend, and an interactive frontend. The portal is designed to streamline library operations and enhance the user experience.
