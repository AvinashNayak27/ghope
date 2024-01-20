import React, { useEffect } from "react";
import NavigationBar from "./Navbar";
import { useAuth } from "../AuthContext";
import axios from "axios";

const Dashboard = () => {
  const { email, address } = useAuth();

  const userDatais = async () => {
    const response = await axios.get(
      `http://localhost:3000/user-by-email?email=${email}`
    );
    if (response.data.walletAddress != address) {
      const response = await axios.post(
        `http://localhost:3000/update-user-wallet`,
        {
          email,
          walletAddress: address,
        }
      );
    }
  }

  useEffect(() => {
    if (email) {
      userDatais();
    }
  }
    , [email]);

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center p-4">
      <NavigationBar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-xl">Welcome, {email || "Guest"}</p>
        <p className="text-xl">Your address is: {address || "Not connected"}</p>
      </div>
    </div>
  );
};

export default Dashboard;
