import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Signup";
import BookList from "./pages/BookList";
import Upload from "./pages/UploadBook";
import Profile from "./pages/Profile";
import Pyqs from "./pages/pyqs";
import UploadPyq from "./pages/UploadPyq";
import ProtectedRoute from "./components/ProtectedRoute";
import FirebaseTest from './components/FirebaseTest';

const App = () => {
  const isLoggedIn = !!localStorage.getItem("user");

  return (
    <Router>
      <Routes>
        {/* Redirect to /books if logged in, else /login */}
        <Route path="/" element={<Navigate to={isLoggedIn ? "/books" : "/login"} />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/test-firebase" element={<FirebaseTest />} />

        {/* Protected Routes */}
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <BookList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/uploadbook"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pyqs"
          element={
            <ProtectedRoute>
              <Pyqs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload-pyq"
          element={
            <ProtectedRoute>
              <UploadPyq />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
