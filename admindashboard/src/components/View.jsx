import React from "react";
import { useParams } from "react-router-dom";
import NavigationBar from "./Navbar";
import axios from "axios";

function View() {
  const { id } = useParams();

  const [product, setProduct] = React.useState({});

  const getProductDetails = async () => {
    try {
      const response = await axios.get(
        `https://ghopebackend.fly.dev/payment-id?uid=${id}`
      );
      setProduct(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };
  const [buyers, setBuyers] = React.useState([]);

  const getBuyerDetails = async () => {
    try {
      const response = await axios.get(
        `https://ghopebackend.fly.dev/buyers-by-payment-id?paymentID=${product?._id}`
      );
      console.log(response.data);
        setBuyers(response.data);
    } catch (error) {
      console.error("Error fetching buyer details:", error);
    }
  };

  React.useEffect(() => {
    getProductDetails();
  }, [id]);

  React.useEffect(() => {
    if (product?._id) {
      getBuyerDetails();
    }
  }, [product]);


  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center p-4">
      <NavigationBar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">
          {product?.productName}'s Payment Dashboard
        </h1>
      </div>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <p className="text-gray-700 dark:text-gray-300">
          Amount: {product?.amount}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Token: {product?.token}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Payment Ref:{" "}
          <a
            href={`https://ghope.vercel.app/pay/${product?.uniquePaymentRef}`}
            target="_blank"
          >
            {product.uniquePaymentRef}
          </a>
        </p>
      </div>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Buyers</h1>
        {buyers?.map((buyer) => (
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <p className="text-gray-700 dark:text-gray-300">
                Email: {buyer?.buyerEmail}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
                Txhash: {buyer?.txhash}
            </p>
            </div>
        ))}
        </div>
    </div>
  );
}

export default View;
