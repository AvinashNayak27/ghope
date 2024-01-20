import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Widget from "./Widget";

function Payment() {
  const { paymentId } = useParams();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const getPaymentDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/payment-id?uid=${paymentId}`);
      setPaymentDetails(response.data);
      const owner = await axios.get(`http://localhost:3000/user?_id=${response.data.owner}`);
      setPaymentDetails((prev) => ({ ...prev, owner: owner.data }));
    } catch (error) {
      console.error("Error fetching payment details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPaymentDetails();
  }, []);

  if (loading) {
    return <p className="text-center text-lg text-white">Loading...</p>;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="max-w-xl w-full bg-gray-900 rounded-lg shadow-md p-6 border border-gray-700">
        <h1 className="text-2xl font-semibold text-white mb-4 ml-10">Payment Page</h1>
        <h2 className="text-lg font-semibold text-gray-300 ml-10">{paymentDetails.productName}</h2>
        <div className="space-y-2 mt-3 text-gray-400 ml-10">
          <p>Amount: {paymentDetails.amount}</p>
          <p>Token: {paymentDetails.token}</p>
          <p>Network: {paymentDetails.network}</p>
          <p>Payment Ref: {paymentDetails.uniquePaymentRef}</p>
          <p>Owner: {paymentDetails.owner.walletAddress}</p>
        </div>
        <div className="mt-4">
        <Widget
          amount={paymentDetails.amount}
          token={paymentDetails.token}
          recipient={paymentDetails.owner.walletAddress}
          paymentId={paymentDetails._id}
        />
        </div>
      </div>
    </div>
  );
}

export default Payment;
