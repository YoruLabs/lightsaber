import { useState } from "react";

import {
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
} from "@web3auth/modal/react";
import { formatEther, parseEther } from "viem";
import {
  useAccount,
  useBalance,
  useSendTransaction,
  useSignMessage,
  useSwitchChain,
} from "wagmi";

import { Spinner } from "@/components/ui";
import { useCopyToClipboard } from "@/hooks";
import { env } from "@/lib/env";
import { formatCurrency } from "@/lib/formatters";

export function Web3AuthDemo() {
  const [message, setMessage] = useState("Hello Web3Auth!");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCopied, copy] = useCopyToClipboard();

  // Web3Auth hooks
  const { connect } = useWeb3AuthConnect();
  const { disconnect: web3AuthDisconnect } = useWeb3AuthDisconnect();

  // Wagmi hooks
  const { address, isConnected, chain } = useAccount();
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
  });
  const { signMessage, isPending: isSigningMessage } = useSignMessage();
  const { sendTransaction, isPending: isSendingTransaction } =
    useSendTransaction();
  const { switchChain } = useSwitchChain();

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await connect();
    } catch (error) {
      console.error("Connection failed:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await web3AuthDisconnect();
    } catch (error) {
      console.error("Disconnect failed:", error);
    }
  };

  const handleSignMessage = async () => {
    if (!message.trim()) return;

    try {
      const signature = await signMessage({ message });
      console.log("Message signed:", signature);
      alert(`Message signed successfully!\nSignature: ${signature}`);
    } catch (error) {
      console.error("Signing failed:", error);
      alert("Failed to sign message");
    }
  };

  const handleSendTransaction = async () => {
    if (!recipient || !amount) {
      alert("Please enter recipient address and amount");
      return;
    }

    try {
      const hash = await sendTransaction({
        to: recipient as `0x${string}`,
        value: parseEther(amount),
      });
      console.log("Transaction sent:", hash);
      alert(`Transaction sent successfully!\nHash: ${hash}`);
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Failed to send transaction");
    }
  };

  const handleCopyAddress = () => {
    if (address) {
      copy(address);
    }
  };

  const handleSwitchToEthereum = () => {
    switchChain({ chainId: 1 }); // Ethereum Mainnet
  };

  const handleSwitchToPolygon = () => {
    switchChain({ chainId: 137 }); // Polygon Mainnet
  };

  if (!isConnected) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Web3Auth Wallet Demo</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Connect your wallet using Web3Auth social login or traditional
              wallet connectors
            </p>
          </div>

          <div className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-semibold">Connect Your Wallet</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose from social logins (Google, GitHub, Discord, Twitter) or
                connect with MetaMask/WalletConnect
              </p>

              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isConnecting ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Connecting...
                  </>
                ) : (
                  "Connect Wallet"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Web3Auth Wallet</h1>
        <button
          onClick={handleDisconnect}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Disconnect
        </button>
      </div>

      {/* Wallet Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Info */}
        <div className="p-6 border rounded-lg space-y-4">
          <h2 className="text-xl font-semibold">Account Information</h2>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Wallet Address
              </label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono break-all">
                  {address}
                </code>
                <button
                  onClick={handleCopyAddress}
                  className={`px-3 py-2 text-sm rounded transition-colors ${
                    isCopied
                      ? "bg-green-500 text-white"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {isCopied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Network
              </label>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                  {chain?.name || "Unknown"} (ID: {chain?.id})
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Balance
              </label>
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded">
                {isBalanceLoading ? (
                  <div className="flex items-center">
                    <Spinner size="sm" className="mr-2" />
                    Loading...
                  </div>
                ) : balance ? (
                  <div className="space-y-1">
                    <div className="text-lg font-semibold">
                      {parseFloat(formatEther(balance.value)).toFixed(4)}{" "}
                      {balance.symbol}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      ≈{" "}
                      {formatCurrency(
                        parseFloat(formatEther(balance.value)) * 2000,
                      )}{" "}
                      {/* Rough ETH price */}
                    </div>
                  </div>
                ) : (
                  "No balance data"
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Network Switching */}
        <div className="p-6 border rounded-lg space-y-4">
          <h2 className="text-xl font-semibold">Network Switching</h2>

          <div className="space-y-3">
            <button
              onClick={handleSwitchToEthereum}
              className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Switch to Ethereum Mainnet
            </button>

            <button
              onClick={handleSwitchToPolygon}
              className="w-full px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Switch to Polygon Mainnet
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sign Message */}
        <div className="p-6 border rounded-lg space-y-4">
          <h2 className="text-xl font-semibold">Sign Message</h2>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message to Sign
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message to sign..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <button
              onClick={handleSignMessage}
              disabled={isSigningMessage || !message.trim()}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSigningMessage ? (
                <div className="flex items-center justify-center">
                  <Spinner size="sm" className="mr-2" />
                  Signing...
                </div>
              ) : (
                "Sign Message"
              )}
            </button>
          </div>
        </div>

        {/* Send Transaction */}
        <div className="p-6 border rounded-lg space-y-4">
          <h2 className="text-xl font-semibold">Send Transaction</h2>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Recipient Address
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount (ETH)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.001"
                step="0.001"
                min="0"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleSendTransaction}
              disabled={isSendingTransaction || !recipient || !amount}
              className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSendingTransaction ? (
                <div className="flex items-center justify-center">
                  <Spinner size="sm" className="mr-2" />
                  Sending...
                </div>
              ) : (
                "Send Transaction"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">✅ Web3Auth Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Social Login (Google, GitHub, Twitter)
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              MetaMask & WalletConnect Integration
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Multi-chain Support
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Balance Display & Formatting
            </li>
          </ul>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Message Signing
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Transaction Sending
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Network Switching
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Wagmi Integration
            </li>
          </ul>
        </div>
      </div>

      {/* Environment Info */}
      <div className="p-6 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
        <h2 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-200">
          🔧 Environment Configuration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium text-blue-700 dark:text-blue-300">
                App Environment:
              </span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  env.isDevelopment
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                    : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                }`}
              >
                {env.APP_ENV.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-blue-700 dark:text-blue-300">
                Web3Auth Network:
              </span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  env.isDevelopment
                    ? "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                }`}
              >
                {env.isDevelopment ? "SAPPHIRE_DEVNET" : "SAPPHIRE_MAINNET"}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium text-blue-700 dark:text-blue-300">
                Client ID:
              </span>
              <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                {env.WEB3_AUTH_CLIENT_ID.slice(0, 8)}...
              </code>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-blue-700 dark:text-blue-300">
                Mode:
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                {env.isDevelopment ? "Development" : "Production"}
              </span>
            </div>
          </div>
        </div>

        {env.isDevelopment && (
          <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-400">
              <strong>Development Mode:</strong> Using Sapphire DevNet for
              testing. Set <code>VITE_APP_ENV=production</code> to use MainNet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
