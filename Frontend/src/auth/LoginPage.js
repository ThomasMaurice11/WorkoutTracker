import React, { useState } from "react";
import axios from "axios";

const LoginPage = ({ navigateTo }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://www.workouttracker.somee.com/api/Auth/login",
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // If server needs cookies
        }
      );

      const { token } = response.data;
      localStorage.setItem("authToken", token);
      navigateTo("home");
    } catch (error) {
      setError(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="bg-yellow-300 p-6 rounded shadow-lg w-full max-w-md">
        <h1 className="text-2xl mb-4 text-center">Login</h1>
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
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="mt-4 text-center">
            Don't have an account?{" "}
            <button
              onClick={() => navigateTo("register")}
              className="text-blue-500"
            >
              Register
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
