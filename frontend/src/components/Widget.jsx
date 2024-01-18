import React, { useState, useEffect } from "react";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

const Widget = () => {
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
  const recipient = "0xD81AC8dC178c16827641EFB94aF24AFeFF4DC72c";

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
        {isConnected && (
          <p className="text-gray-700 mb-2">
            Connected to <span className="font-semibold">{address}</span>
          </p>
        )}
        <ConnectKitButton.Custom>
          {({ isConnected, show, chain }) => (
            <button
              onClick={show}
              disabled={!isAmountEntered}
              className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full transition duration-300 ease-in-out ${
                !isAmountEntered ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isConnected
                ? `Connected Successfully to ${chain.name}`
                : "Connect Wallet"}
            </button>
          )}
        </ConnectKitButton.Custom>
      </div>

      <div>
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
