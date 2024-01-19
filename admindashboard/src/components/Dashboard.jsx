import React from "react";
import NavigationBar from "./Navbar";
import { useAuth } from "../AuthContext";

const Dashboard = () => {
  const { email, address } = useAuth();

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
