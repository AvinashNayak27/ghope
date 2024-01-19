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

const smartWalletOptions = {
  factoryAddress: "0x97a277e9b325785b9a4c33d4e39c8d6193b54f83",
  gasless: true,
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThirdwebProvider
      activeChain={Sepolia}
      clientId="77f35f00fe1757e3cbd833a9ab3b6375"
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
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create" element={<CreateAppForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/view-products" element={<Viewapps />} />
        </Routes>
      </Router>
    </ThirdwebProvider>
  </React.StrictMode>
);
