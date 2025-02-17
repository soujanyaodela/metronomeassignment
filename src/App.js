import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from './components/Dashboard';
import Login from "./components/login";
import Homepage from "./components/Homepage";
import Register from "./components/register";
import { auth } from "./components/firebase"; // Ensure Firebase is properly configured


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false); // Track registration status

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    }

    // Firebase authentication listener
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (registering) {
        return; // Don't update user state while registering
      }
      
      if (authUser) {
        const userData = { uid: authUser.uid, name: authUser.displayName || "User" };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [registering]); // Reacts to `registering` state changes

  if (loading || registering) {
    return (
      <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Signup successfully Please Login</p>
     </div>

    );
  }

  return (
    <Router>
      <Routes>
    
  <Route path="/" element={<Navigate to={user ? "/Homepage" : "/login"} />} />
  <Route path="/login" element={user ? <Navigate to="/Homepage" /> : <Login setUser={setUser} />} />
  <Route path="/register" element={user ? <Navigate to="/Homepage" /> : <Register setRegistering={setRegistering} />} />
  <Route path="/Homepage" element={user ? <Homepage user={user} setUser={setUser} /> : <Navigate to="/login" />} />
  <Route path="/dashboard" element={<Dashboard />} />
  
</Routes>

 
      <ToastContainer />
    </Router>
  );
}

export default App;
