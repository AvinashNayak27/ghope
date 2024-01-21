import React, { useState, useEffect } from "react";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import axios from "axios";
const Widget = ({
  amount,
  recipient,
  token,
  paymentId,
  redirectURL,
  webhookURL,
}) => {
  const { isConnected } = useAccount();
  const isAmountEntered = amount && amount > 0;

  // Define the token details
  const tokens = {
    GHO: {
      address: "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60",
      decimals: 18,
    },
    DAI: {
      address: "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357",
      decimals: 18,
    },
    USDT: {
      address: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0",
      decimals: 6,
    },
  };

  const ERC20_ABI = [
    {
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const selectedTokenInfo = tokens["GHO"];
  const isValidAmount = !isNaN(parseFloat(amount));
  const [email, setEmail] = useState("");

  const { config } = usePrepareContractWrite(
    recipient && isValidAmount
      ? {
          address: selectedTokenInfo?.address,
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [
            recipient,
            // Ensure proper conversion to the correct decimal
            (
              parseFloat(amount) * Math.pow(10, selectedTokenInfo.decimals)
            ).toString(),
          ],
        }
      : undefined
  );

  const { writeAsync, error } = useContractWrite(config);
  const [transactionHash, setTransactionHash] = useState(null);
  const { data, isError, isLoading } = useWaitForTransaction({
    hash: transactionHash,
  });

  const handleTransactionSubmit = async () => {
    if (!writeAsync) return;
    try {
      const tx = await writeAsync();
      setTransactionHash(tx.hash);
    } catch (error) {
      console.error("Transaction error:", error);
    }
  };

  useEffect(() => {
    if (error) {
      console.error("Error in transaction:", error.message);
    }
  }, [error]);

  const createBuyer = async () => {
    if (data) {
      try {
        console.log("Transaction successful:", data);
        const res = await axios.post(`https://ghopebackend.fly.dev/create-buyer`, {
          paymentID: paymentId,
          buyerEmail: email,
          txhash: transactionHash,
        });
        console.log("Buyer created:", res.data);
      } catch (error) {
        console.error("Error creating buyer:", error.message);
      }
    }
  };

  const sendWebhook = async () => {
    if (data) {
      try {
        console.log("Transaction successful:", data);
        const res = await axios.post(webhookURL, {
          txHash: transactionHash,
          email: email,
        });
        console.log("Webhook sent:", res.data);
      } catch (error) {
        console.error("Error sending webhook:", error.message);
      }
    }
  };

  useEffect(() => {
    createBuyer();
    sendWebhook();
  }, [data]);

  return (
    <div className="bg-gray-800 text-white border-gray-600 border rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-300"
        >
          Email Address:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="you@example.com"
        />
      </div>

      <div className="mb-4">
        <ConnectKitButton.Custom>
          {({ isConnected, show, chain, truncatedAddress }) => (
            <button
              onClick={show}
              className={`py-2 px-4 rounded-lg font-bold text-white w-full transition duration-300 ease-in-out ${
                isConnected
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isConnected ? `${truncatedAddress}` : "Connect Wallet"}
            </button>
          )}
        </ConnectKitButton.Custom>
      </div>

      <div>
        <button
          className={`py-2 px-4 rounded-lg font-bold text-white w-full transition duration-300 ease-in-out ${
            isConnected && isAmountEntered
              ? "bg-green-600 hover:bg-green-700"
              : "bg-green-500 hover:bg-green-600 opacity-50 cursor-not-allowed"
          }`}
          disabled={!isConnected || !isAmountEntered}
          onClick={handleTransactionSubmit}
        >
          Send
        </button>
      </div>

      {isLoading && <div>Processing…</div>}
      {isError && <div>Transaction error</div>}
      {data && (
        <>
          <p className="text-green-600">
            Transaction successful! View on{" "}
            <a
              href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Etherscan
            </a>
          </p>
          <a href={redirectURL} className="text-green-600">
            <button>Redirect to Merchant Website</button>
          </a>
        </>
      )}
    </div>
  );
};

export default Widget;
