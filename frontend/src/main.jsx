import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { WagmiConfig, createConfig } from "wagmi";
import {
  ConnectKitProvider,
  getDefaultConfig,
} from "connectkit";
import { sepolia } from "wagmi/chains";
const chains = [sepolia] 


const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: 'IhPxRG5ZFQ9r7YAE5P4BDplGR0HmtJ8y', // or infuraId
    walletConnectProjectId: '3c28c455f2030d70d1c536c1e1260699',
    appName: "Your App Name",
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // 
    chains:chains,
  })
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        <App />
      </ConnectKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
