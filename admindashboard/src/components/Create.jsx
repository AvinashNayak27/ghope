import React, { useState } from "react";
import { useAddress } from "@thirdweb-dev/react";
import NavigationBar from "./Navbar";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { v4 as uuidv4 } from "uuid";

const CreateAppForm = () => {
  const { email } = useAuth();
  const address = useAddress();

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
      console.log("User updated:", response.data);
    }
  };

  React.useEffect(() => {
    if (email) {
      userDatais();
    }
  }, [email]);

  const [formData, setFormData] = useState({
    appName: "",
    amount: "",
    token: "GHO",
    network: "Sepolia",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getUser = async () => {
    const response = await axios.get(
      `http://localhost:3000/user-by-email?email=${email}`
    );
    console.log(response?.data);

    return response?.data;
  };

  const createPaymentID = async (
    productName,
    owner,
    amount,
    token,
    network,
    uid
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/create-payment-id",
        {
          productName,
          owner,
          amount,
          token,
          network,
          uid,
        }
      );
      console.log("PaymentID created:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating payment ID:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { appName, amount, token, network } = formData;
    console.log(formData);
    const uniquepaymentId = uuidv4();
    const user = await getUser();
    if (user && user._id) {
      const paymentId = await createPaymentID(
        appName,
        user._id,
        amount,
        token,
        network,
        uniquepaymentId
      );

      if (paymentId) {
        window.location.href = `/view-products`;
      }
    }
  };


  // Define your token and network options
  const TokenList = ["GHO", "USDC", "USDT", "DAI"];
  const Networks = ["Sepolia", "Arbitrum Sepolia", "Mumbai", "Optimism Goerli"];

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
              <select
                className="w-5/6 block bg-gray-700 text-white border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-gray-600"
                id="token"
                name="token"
                value={formData.token}
                onChange={handleChange}
              >
                {TokenList.map((token) => (
                  <option key={token} value={token}>
                    {token}
                  </option>
                ))}
              </select>
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
              <select
                className="w-5/6 block bg-gray-700 text-white border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-gray-600"
                id="network"
                name="network"
                value={formData.network}
                onChange={handleChange}
              >
                {Networks.map((network) => (
                  <option key={network} value={network}>
                    {network}
                  </option>
                ))}
              </select>
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
