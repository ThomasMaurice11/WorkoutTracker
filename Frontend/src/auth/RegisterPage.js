import React, { useState } from "react";
import axios from "axios";

const RegisterPage = ({ navigateTo }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // For handling errors

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Register the user
      await axios.post(
        "https://www.workouttracker.somee.com/api/Auth/register",
        { username, email, password }
      );

      // After successful registration, attempt to log in
      const loginResponse = await axios.post(
        "https://www.workouttracker.somee.com/api/Auth/login",
        {
          username,
          password,
        }
      );

      // Check if login was successful
      if (loginResponse.status === 200) {
        // Save the token from the login response
        const { token } = loginResponse.data;
        localStorage.setItem("authToken", token);

        // Navigate to home page after successful registration and login
        navigateTo("home");
      } else {
        // Handle unexpected login response status
        setError("Login after registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Registration failed. Please check your details and try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="bg-yellow-300 p-6 rounded shadow-lg w-full max-w-md">
        <h1 className="text-2xl mb-4 text-center">Register</h1>
        <form onSubmit={handleSubmit} className="w-full">
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="border border-gray-300 p-2 w-full rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-300 p-2 w-full rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-300 p-2 w-full rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-black text-white py-2 px-4 rounded w-full"
          >
            Register
          </button>
          <p className="mt-4 text-center">
            Already have an account?{" "}
            <button
              onClick={() => navigateTo("login")}
              className="text-blue-500"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
