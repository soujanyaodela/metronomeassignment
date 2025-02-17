import { createUserWithEmailAndPassword, signOut, updateProfile  } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import "./register.css";

function Register({ setRegistering }) { // Accept setRegistering as prop
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { position: "bottom-center" });
      return;
    }
  
    setLoading(true);
    setRegistering(true); // Prevent homepage flash
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Update Firebase Authentication profile with full name
      await updateProfile(user, {
        displayName: fullName
      });
  
      // Store user details in Firestore
      await setDoc(doc(db, "Users", user.uid), {
        email: user.email,
        fullName: fullName,
        photo: "",
      });
  
      console.log("User Registered:", user.displayName); // Logs the name
  
      toast.success("Registration successful!", { position: "top-center" });
  
      // Log out immediately to ensure redirection to login
      await signOut(auth);
  
      // Redirect to login page
      navigate("/login", { replace: true });
  
    } catch (error) {
      console.error("Registration error:", error.message);
      toast.error(error.message, { position: "bottom-center" });
    } finally {
      setLoading(false);
      setRegistering(false);
    }
  };

  return (
    <div className="register-container">
      <video autoPlay loop muted className="background-video">
        <source src="/about.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="overlay"></div>
      <div className="container vh-100 d-flex align-items-center justify-content-center">
        <div className="row w-100">
          <div className="col-md-6 d-flex align-items-center justify-content-center">
            <div className="register-form">
              <h3 className="text-center">Register</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

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

                <div className="mb-3">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                  </button>
                </div>
                <p className="forgot-password text-center mt-2">
                  Already have an account? <a href="/login">Login Here</a>
                </p>
              </form>
            </div>
          </div>

          <div className="col-md-6 d-flex align-items-center justify-content-center">
            <h1 className="text-white text-shadow">
              Start Your Trading Journey with Capital Rush!
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
