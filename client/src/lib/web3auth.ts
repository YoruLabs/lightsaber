import {
  MFA_LEVELS,
  WALLET_CONNECTORS,
  WEB3AUTH_NETWORK,
} from "@web3auth/modal";
import { type Web3AuthContextConfig } from "@web3auth/modal/react";

import { env } from "./env";

// Select network based on environment
const getWeb3AuthNetwork = () => {
  if (env.isDevelopment) {
    return WEB3AUTH_NETWORK.SAPPHIRE_DEVNET;
  }
  return WEB3AUTH_NETWORK.SAPPHIRE_MAINNET;
};

export const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId: env.WEB3_AUTH_CLIENT_ID,
    web3AuthNetwork: getWeb3AuthNetwork(),
    mfaLevel: MFA_LEVELS.OPTIONAL,
    modalConfig: {
      connectors: {
        [WALLET_CONNECTORS.AUTH]: {
          label: "Social Login",
          loginMethods: {
            google: {
              name: "Google",
              mainOption: true,
              showOnModal: true,
            },
            github: {
              name: "GitHub",
              mainOption: true,
              showOnModal: true,
            },
            twitter: {
              name: "Twitter",
              mainOption: true,
              showOnModal: true,
            },
          },
        },
        [WALLET_CONNECTORS.WALLET_CONNECT_V2]: {
          label: "Wallet Connect",
          showOnModal: true,
        },
        [WALLET_CONNECTORS.METAMASK]: {
          label: "MetaMask",
          showOnModal: true,
        },
      },
    },
  },
};

// Log Web3Auth configuration in development
if (env.isDevelopment) {
  console.log("🔐 Web3Auth Configuration:", {
    network: getWeb3AuthNetwork(),
    clientId: env.WEB3_AUTH_CLIENT_ID.slice(0, 10) + "...",
    environment: env.APP_ENV,
  });
}
