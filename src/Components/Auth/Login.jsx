import React, { useState } from "react";
import { auth, GoogleProvider } from "../Firebase_config/Firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential);
      alert("Login successful");
      navigate("/CommunityForum");
    } catch (e) {
      alert("Error Signing in");
      console.log(e);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, GoogleProvider);
      console.log(result);
      alert("Google Login successful");
      navigate("/CommunityForum");
    } catch (error) {
      alert("Error Signing in with Google");
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="auth-box">
        <h2>Login</h2>
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="Email">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your valid Email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your Password"
            />
          </div>
          <button className="Auth-btn" type="submit">
            Login
          </button>
          <button
            className="Auth-btn"
            type="button"
            onClick={handleGoogleLogin} // Added onClick event for Google login
          >
            Login with Google
          </button>
          <p>
            {" "}
            No account yet? SignUp <Link to="/">here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
