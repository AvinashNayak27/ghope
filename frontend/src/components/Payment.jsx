import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

function Payment() {
  const { paymentId } = useParams();
  const [payemntDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const getPaymentDetails = async () => {
    const response = await axios.get(
      `http://localhost:3000/payment-id?uid=${paymentId}`
    );
    setPaymentDetails(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getPaymentDetails();
  }, []);

  return (
    <div>
      <h1>Payment Page</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>Product Name: {payemntDetails.productName}</p>
          <p>Amount: {payemntDetails.amount}</p>
          <p>Token: {payemntDetails.token}</p>
          <p>Network: {payemntDetails.network}</p>
          <p>Payment Ref: {payemntDetails.uniquePaymentRef}</p>
        </div>
      )}
    </div>
  );
}

export default Payment;
