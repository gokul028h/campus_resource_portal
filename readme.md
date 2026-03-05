# Full Stack Application

A full-stack web application consisting of a **React frontend** and **Node.js backend** designed to demonstrate modern web development practices including API integration, modular architecture, and scalable deployment.

---

## Project Structure

```
project-root
│
├── client/                 # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│
├── server/ (if backend exists)
│   ├── routes/
│   ├── controllers/
│   ├── models/
│
├── package.json
├── .gitignore
└── README.md
```

---

## Features

* Modern React based UI
* REST API integration
* Modular folder structure
* Environment variable configuration
* Scalable architecture
* Easy setup and deployment

---

## Tech Stack

Frontend

* React.js
* JavaScript
* HTML5
* CSS3

Backend (if applicable)

* Node.js
* Express.js
* MongoDB / Mongoose

Development Tools

* Git
* npm
* VS Code

---

## Installation

Clone the repository

```
git clone https://github.com/gokul028h/campus_resource_portal.git
```

Move into the project directory

```
cd campus_resource_portal
```

---

## Install Dependencies

### Root dependencies

```
npm install
```

### Frontend dependencies

```
cd client
npm install
```

---

## Running the Application

Start the frontend

```
cd client
npm start
```

If backend exists

```
cd server
npm start
```

The application will run at

```
http://localhost:3000
```

---

## Environment Variables

Create a `.env` file in the root directory and add required configuration variables.

Example:

```
PORT=5000
MONGO_URI=your_database_url
API_KEY=your_api_key
```

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## License

This project is open source and available under the MIT License.

---

## Author

Developed as part of a full-stack development project demonstrating frontend and backend integration using modern JavaScript frameworks.
