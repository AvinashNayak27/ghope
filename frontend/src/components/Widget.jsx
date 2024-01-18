import React, { useState, useEffect } from "react";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { useParams } from "react-router-dom";

const Widget = () => {
  const params = useParams()
  const recipient = params.recipient
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("GHO");
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
  const { address, isConnected } = useAccount();
  const isAmountEntered = amount.trim() !== "";
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

  const isValidAmount = !isNaN(parseFloat(amount));
  const selectedTokenInfo = tokens[selectedToken];

  const { config } = usePrepareContractWrite(
    recipient && isValidAmount
      ? {
          address: selectedTokenInfo?.address,
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [
            recipient,
            amount.toString() * 10 ** selectedTokenInfo.decimals,
          ],
        }
      : undefined
  );

  const { write, error } = useContractWrite(config);

  useEffect(() => {
    if (error) {
      console.error("Error in transaction:", error.message);
    }
  }, [error]);

  const [showConnectButton, setShowConnectButton] = useState(false);
  const [showSendButton, setShowSendButton] = useState(false);

  useEffect(() => {
    setShowConnectButton(isAmountEntered);
  }, [isAmountEntered]);

  useEffect(() => {
    setShowSendButton(isConnected);
  }, [isConnected]);


 // if useparams doesn't start with 0x, display error

  if (recipient.length < 42) {
    return (
      <div className="bg-white border-gray-300 border rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <h2 className="text-gray-800 text-2xl font-semibold mb-4">
          Error
        </h2>
        <p className="text-gray-800 text-2xl font-semibold mb-4">
          Please enter a valid Ethereum address
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border-gray-300 border rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h2 className="text-gray-800 text-2xl font-semibold mb-4">
        Transfer Tokens
      </h2>

      <div className="flex space-x-4 mb-4">
        <div className="flex-1">
          <label htmlFor="amount" className="text-gray-700 block mb-2">
            Amount:
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border-gray-300 border rounded focus:ring focus:ring-blue-200 focus:border-blue-300"
            placeholder="0.0"
          />
        </div>

        <div className="flex-1">
          <label htmlFor="token" className="text-gray-700 block mb-2">
            Token:
          </label>
          <select
            id="token"
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="w-full p-2 border-gray-300 border rounded focus:ring focus:ring-blue-200 focus:border-blue-300"
          >
            {Object.keys(tokens).map((token) => (
              <option key={token} value={token}>
                {token}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <div
          className={`transition-all ease-in-out duration-300 ${
            showConnectButton ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ConnectKitButton.Custom>
            {({ isConnected, show, chain, truncatedAddress }) => (
              <button
                onClick={show}
                disabled={!isAmountEntered}
                className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full transition duration-300 ease-in-out ${
                  !isAmountEntered ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isConnected ? `${truncatedAddress}` : "Connect Wallet"}
              </button>
            )}
          </ConnectKitButton.Custom>
        </div>
      </div>

      <div
        className={`transition-all ease-in-out duration-300 ${
          showSendButton ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <button
          className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full transition duration-300 ease-in-out ${
            !isConnected || !isAmountEntered
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={!isConnected || !isAmountEntered}
          onClick={() => write?.()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Widget;
