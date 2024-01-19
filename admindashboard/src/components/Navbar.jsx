import React from "react";
import { Link } from "react-router-dom"; // Assuming you're using react-router for navigation
import { ConnectWallet } from "@thirdweb-dev/react";
const NavigationBar = () => {
  return (
    <nav
      className="bg-gray-800 text-white shadow-lg rounded-md mb-10"
      style={{
        background:
          "linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.1))",
      }}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <Link
                  to="/"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/create"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Create payment link
                </Link>
                <Link
                  to="/view-products"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  View products
                </Link>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <ConnectWallet
              btnTitle={"Login"}
              modalSize={"compact"}
              welcomeScreen={{}}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
