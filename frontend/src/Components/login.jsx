import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "./UserContext";
import Navbar from "./Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faSignInAlt } from "@fortawesome/free-solid-svg-icons";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { setUser } = useUserContext();

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
        console.log(data.token);
        const userDetailsResponse = await fetch(
          `http://localhost:8080/api/users/details?email=${email}`
        );

        if (userDetailsResponse.ok) {
          const ud = await userDetailsResponse.json();
          localStorage.setItem("name", ud["username"]);
          localStorage.setItem("id", ud["id"]);
          console.log("Hello");
          setUser({ name: ud["name"], email: email, id: ud["id"] });
          navigate("/courses");
        } else {
          setError("An error occurred while fetching user details.");
        }
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="auth">
        <div className="container" style={{ overflow: 'hidden', paddingTop: '30px' }}>
          <h2 style={{ textAlign: 'center', margin: '0 0 20px 0', fontSize: '28px' }}>Welcome Back!</h2>
          <p style={{ textAlign: 'center', marginBottom: '25px', color: 'var(--text-secondary)' }}>
            Sign in to continue your learning journey
          </p>
          <form autoComplete="off" className="form-group" onSubmit={login}>
            <div className="input-wrapper" style={{ marginBottom: '20px', position: 'relative' }}>
              <label htmlFor="email">Email</label>
              <div style={{ position: 'relative' }}>
                <FontAwesomeIcon 
                  icon={faEnvelope} 
                  style={{ 
                    position: 'absolute', 
                    left: '15px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: 'var(--text-secondary)' 
                  }} 
                />
                <input
                  type="email"
                  className="form-control"
                  style={{ 
                    width: "100%", 
                    padding: '12px 15px 12px 45px',
                    borderRadius: '6px',
                    border: '1px solid var(--dark-border)'
                  }}
                  placeholder="your@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                />
              </div>
            </div>
            
            <div className="input-wrapper" style={{ marginBottom: '25px', position: 'relative' }}>
              <label htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <FontAwesomeIcon 
                  icon={faLock} 
                  style={{ 
                    position: 'absolute', 
                    left: '15px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: 'var(--text-secondary)' 
                  }} 
                />
                <input
                  type="password"
                  className="form-control"
                  style={{ 
                    width: "100%", 
                    padding: '12px 15px 12px 45px',
                    borderRadius: '6px',
                    border: '1px solid var(--dark-border)'
                  }}
                  placeholder="Your password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                />
              </div>
            </div>
            
            <div className="btn1">
              <button 
                type="submit" 
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <FontAwesomeIcon icon={faSignInAlt} /> Sign In
              </button>
            </div>
          </form>
          
          {error && (
            <div style={{ 
              padding: '10px 15px', 
              backgroundColor: 'rgba(220, 53, 69, 0.1)', 
              color: 'var(--danger)', 
              borderRadius: '4px', 
              marginTop: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          
          <div style={{ marginTop: '25px', textAlign: 'center' }}>
            <span>
              Don't have an account? <Link to="/register" style={{ fontWeight: '600' }}>Register Here</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
