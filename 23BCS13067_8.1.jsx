import React, { useState } from "react";

export default function LoginForm() {
  // Step 1: Define state variables for username, password, and message
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Step 2: Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh

    // Step 3: Simple validation
    if (username === "admin" && password === "12345") {
      setMessage(`Welcome, ${username}! 🎉`);
    } else {
      setMessage("Invalid username or password ❌");
    }

    // Optionally clear fields
    setUsername("");
    setPassword("");
  };

  return (
    <div
      style={{
        width: "320px",
        margin: "80px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}
    >
      <h2>Login Form</h2>

      {/* Step 4: Login Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc"
            }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc"
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          Login
        </button>
      </form>

      {/* Step 5: Display message */}
      {message && (
        <p style={{ marginTop: "15px", color: message.includes("Welcome") ? "green" : "red" }}>
          {message}
        </p>
      )}
    </div>
  );
}
