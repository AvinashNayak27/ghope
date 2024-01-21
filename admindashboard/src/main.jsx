import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  ThirdwebProvider,
  smartWallet,
  embeddedWallet,
  localWallet,
} from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/Landing.jsx";
import CreateAppForm from "./components/Create.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Viewapps from "./components/Viewapps.jsx";
import { AuthProvider } from "./AuthContext.jsx";
import axios from "axios";

const smartWalletOptions = {
  factoryAddress: "0x97a277e9b325785b9a4c33d4e39c8d6193b54f83",
  gasless: true,
};

const baseURL = "https://ghopebackend.fly.dev";
import View from "./components/View.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThirdwebProvider
      activeChain={Sepolia}
      clientId="8c01910f5d85805c35ee554294b9e5a4"
      supportedWallets={[
        smartWallet(localWallet(), smartWalletOptions),
        smartWallet(
          embeddedWallet({
            auth: {
              options: ["email", "google"],
            },
            onAuthSuccess: async (user) => {
              console.log("User logged in:", user);
              const email = user?.storedToken?.authDetails?.email;
              const walletAddress = user?.walletDetails?.walletAddress;

              const userExists = await axios.get(
                `${baseURL}/user-exists?email=${email}`
              );

              console.log("User exists:", userExists.data);

              if (!userExists?.data) {
                const response = await axios.post(`${baseURL}/create-user`, {
                  email,
                  walletAddress,
                });
                console.log("User created:", response.data);
              }
            },
          }),
          smartWalletOptions
        ),
      ]}
    >
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/create" element={<CreateAppForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/view-products" element={<Viewapps />} />
            <Route path="/view-products/:id" element={<View />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThirdwebProvider>
  </React.StrictMode>
);
