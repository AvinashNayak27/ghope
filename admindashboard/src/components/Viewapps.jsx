import React from "react";
import NavigationBar from "./Navbar";
import { useAuth } from "../AuthContext";
import axios from "axios";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-2 border-black">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        {product.productName}
      </h2>
      <p className="text-gray-700 dark:text-gray-300">
        Amount: {product.amount}
      </p>
      <p className="text-gray-700 dark:text-gray-300">Token: {product.token}</p>
      <p className="text-gray-700 dark:text-gray-300">
        Network: {product.network}
      </p>
      <p className="text-gray-700 dark:text-gray-300">
        Payment Ref: {product.uniquePaymentRef}
      </p>
    </div>
  );
};

const Spinner = () => {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  };
  

const ViewApps = () => {
  const { email, address } = useAuth();
  const [products, setProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);


  React.useEffect(() => {
    setIsLoading(true); // Start loading
    if (email) {
        axios.get(`http://localhost:3000/payment-ids-by-user?email=${email}`)
          .then(response => {
            setProducts(response.data);
            setIsLoading(false); // Stop loading on success
          })
          .catch(error => {
            console.log(error);
            setIsLoading(false); // Stop loading on error
          });
      }
  }, [email]);

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center p-4">
      <NavigationBar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">View Products</h1>
      </div>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {isLoading && <Spinner />}
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products &&
          products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
      </div>
    </div>
  );
};

export default ViewApps;
