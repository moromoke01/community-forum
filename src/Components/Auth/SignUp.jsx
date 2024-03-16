import React, { useState } from "react";
import { auth, firestore } from "../Firebase_config/Firebase"; // Assuming db is your Firestore instance
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore"; // Import Firestore functions
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Add user information to Firestore
      await addDoc(collection(firestore, "users"), {
        username: username,
        email: email,
      });

      // // Save username in local storage
      // localStorage.setItem('username', username);

      alert("User Account created");
      navigate("/Login");
      console.log(userCredential);
    } catch (error) {
      alert("Error in creating Account");
      console.log(error.message);
    }
  };

  return (
    <div className="container">
      <div className="auth-box">
        <h2>Create Account</h2>
        <form onSubmit={handleSignUp}>
          <div className="input-group">
            <label htmlFor="Username">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter Username"
            />
          </div>

          <div className="input-group">
            <label htmlFor="Email">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter Email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Create your Password"
            />
          </div>

          <button className="Auth-btn" type="submit">
            Sign-Up
          </button>
          <p>
            Already have an account? Login <Link to="/Login">here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
