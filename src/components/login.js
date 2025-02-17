import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./login.css";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          localStorage.setItem("jwtToken", token);
          setUser(true); // Update user state
          navigate("/Homepage");
        } catch (error) {
          console.error("Error getting token", error);
        }
      }
    });

    return () => unsubscribe();
  }, [navigate, setUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      // Request custom token from backend
      const response = await axios.post("https://backend-vcd4.onrender.com/generateToken", {
        uid: firebaseUser.uid,
      });

      if (response.data.token) {
        localStorage.setItem("jwtToken", response.data.token); // Store custom token
        setUser(true); // Update user state
        toast.success("User logged in Successfully", { position: "top-center" });
        navigate("/Homepage");
      } else {
        toast.error("Failed to authenticate with server", { position: "bottom-center" });
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  return (
    <div className="login-container">
      <video autoPlay loop muted className="background-video">
        <source src="/login.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="overlay"></div>
      <div className="container vh-100 d-flex align-items-center justify-content-center">
        <div className="row w-100">
          <div className="col-md-6 d-flex align-items-center justify-content-center">
            <h1 className="text-white text-shadow">
              Metronome Technologies is an energy intelligence company.
            </h1>
          </div>
          <div className="col-md-6 d-flex align-items-center justify-content-center">
            <div className="login-form">
              <h3 className="text-center">Login</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label>Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
                <p className="forgot-password text-center mt-2">
                  New user? <a href="/register">SignUp Here</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
