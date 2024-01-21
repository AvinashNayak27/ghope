import React, { useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";

function RegistrationPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await axios.post(`http://localhost:3000/register`, {
        email,
        password,
      });

      if (!response.ok) {
        throw new Error(response.message || "Error registering");
      }

      // Handle successful registration (e.g., redirect to login page)
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="p-8">
      <Navbar />
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-full max-w-xs">
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="******************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Register
              </button>
            </div>
            {error && <p className="text-red-500 text-xs italic">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
