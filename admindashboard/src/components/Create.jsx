import React, { useState } from "react";
import { useAddress } from "@thirdweb-dev/react";
import { ConnectWallet } from "@thirdweb-dev/react";
import NavigationBar from "./Navbar";

const CreateAppForm = () => {
  const [formData, setFormData] = useState({
    appName: "",
    amount: "",
    token: "",
    network: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  const address = useAddress();

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center p-4">
      <NavigationBar />

      <div className="w-full max-w-2xl bg-gray-700 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Create a payment link
          </h2>
          {!address && (
            <div className="flex justify-center">
              Please login to create a payment link
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full mt-4">
            <div className="mb-4">
              <div className="flex items-center">
                <label
                  className="w-1/6 block uppercase tracking-wide text-gray-200 text-xs font-bold mr-2"
                  htmlFor="appName"
                >
                  Product Name
                </label>
                <input
                  className="w-5/6 appearance-none block bg-gray-700 text-white border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-gray-600"
                  id="appName"
                  type="text"
                  placeholder="Your Product Name"
                  name="appName"
                  value={formData.appName}
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* Repeat the above div for each field (amount, token, network) */}
            <div className="mb-4">
              <div className="flex items-center">
                <label
                  className="w-1/6 block uppercase tracking-wide text-gray-200 text-xs font-bold mr-2"
                  htmlFor="amount"
                >
                  Amount
                </label>
                <input
                  className="w-5/6 appearance-none block bg-gray-700 text-white border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-gray-600"
                  id="amount"
                  type="text"
                  placeholder="Amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center">
                <label
                  className="w-1/6 block uppercase tracking-wide text-gray-200 text-xs font-bold mr-2"
                  htmlFor="token"
                >
                  Token
                </label>
                <input
                  className="w-5/6 appearance-none block bg-gray-700 text-white border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-gray-600"
                  id="token"
                  type="text"
                  placeholder="Token"
                  name="token"
                  value={formData.token}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center">
                <label
                  className="w-1/6 block uppercase tracking-wide text-gray-200 text-xs font-bold mr-2"
                  htmlFor="network"
                >
                  Network
                </label>
                <input
                  className="w-5/6 appearance-none block bg-gray-700 text-white border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-gray-600"
                  id="network"
                  type="text"
                  placeholder="Network"
                  name="network"
                  value={formData.network}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Create Link
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default CreateAppForm;
