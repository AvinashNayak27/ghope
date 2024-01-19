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
import { useAuth } from "./AuthContext.jsx";

const smartWalletOptions = {
  factoryAddress: "0x97a277e9b325785b9a4c33d4e39c8d6193b54f83",
  gasless: true,
};

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
          </Routes>
        </Router>
      </AuthProvider>
    </ThirdwebProvider>
  </React.StrictMode>
);
