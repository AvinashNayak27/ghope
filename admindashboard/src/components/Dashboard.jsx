import React, { useEffect, useState } from "react";
import NavigationBar from "./Navbar";
import { useAuth } from "../AuthContext";
import axios from "axios";
import { useBalance } from "@thirdweb-dev/react";
import { useContract, useTransferToken, Web3Button } from "@thirdweb-dev/react";

const Dashboard = () => {
  const { email, address } = useAuth();
  const [receiverAddress, setReceiverAddress] = useState("");
  const [showInput, setShowInput] = useState(false);

  const userDatais = async () => {
    const response = await axios.get(
      `https://ghopebackend.fly.dev/user-by-email?email=${email}`
    );
    if (response.data.walletAddress !== address) {
      const updateResponse = await axios.post(
        `https://ghopebackend.fly.dev/update-user-wallet`,
        {
          email,
          walletAddress: address,
        }
      );
      console.log("User updated:", updateResponse.data);
    }
  };

  useEffect(() => {
    if (email) {
      userDatais();
    }
  }, [email]);

  const GHOAddress = "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60";

  const { data: tokenInfo } = useBalance(GHOAddress);

  const { contract } = useContract(GHOAddress);
  const {
    mutate: transferTokens,
    isLoading,
    error,
    data,
  } = useTransferToken(contract);

  console.log("tokenInfo", tokenInfo);

  const handleTransfer = () => {
    transferTokens({
      to: receiverAddress,
      amount: tokenInfo?.displayValue,
    });
    setShowInput(false);
    setReceiverAddress("");
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center p-4">
      <NavigationBar />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-xl">Welcome, {email || "Guest"}</p>

        {tokenInfo && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold">Your balance</h2>

            <div className="bg-gray-700 p-6 rounded-lg mt-4 flex">
              <div className="flex-grow">
                <p className="text-lg">Name: {tokenInfo.name}</p>
                <p className="text-lg">Symbol: {tokenInfo.symbol}</p>
                <p className="text-lg">Balance: {tokenInfo.displayValue}</p>
              </div>
              <div className="flex-grow w-1/3 mt-auto ml-32">
                {showInput ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Receiver Address"
                      value={receiverAddress}
                      onChange={(e) => setReceiverAddress(e.target.value)}
                      className="mr-2 p-2 border border-gray-500 rounded text-black"
                    />
                    <button
                      className="bg-green-500 text-white p-2 rounded"
                      onClick={handleTransfer}
                    >
                      Confirm
                    </button>
                    <button
                      className="bg-red-500 text-white p-2 ml-2 rounded"
                      onClick={() => setShowInput(false)}
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <Web3Button
                    contractAddress={GHOAddress}
                    action={() => setShowInput(true)}
                    isDisabled={tokenInfo?.displayValue === "0.0"}
                  >
                    Withdraw
                  </Web3Button>
                )}
                {isLoading && (
                  <div className="flex-grow w-1/3 mt-auto ml-8">
                    <p className="text-lg">Processing...</p>
                  </div>
                )}
                {error && (
                  <div className="flex-grow w-1/3 mt-auto ml-8">
                    <p className="text-lg">Error: {error.message}</p>
                  </div>
                )}
                {data && (
                  <div className="flex-grow w-1/3 mt-auto ml-8">
                    <p className="text-lg">Success!</p>
                    <p className="text-lg">
                      <a
                        href={`https://sepolia.etherscan.io/tx/${data.receipt.transactionHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        View on Etherscan
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
