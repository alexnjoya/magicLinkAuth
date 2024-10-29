// components/AuthForm.js
import { useState } from "react";
import Image from "next/image";
import { magic } from "../lib/magic";
import "../globals.css"
import MetaMask from "./images/metamask.png"
import WalletConnect from "./images/wallet-connect.png"

import { ethers } from "ethers"; 
import WalletConnectProvider from "@walletconnect/web3-provider";


export default function AuthForm({ setUser }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const didToken = await magic.auth.loginWithMagicLink({ email });
      const userMetadata = await magic.user.getMetadata();
      setUser(userMetadata);
    } catch (error) {
      console.error("Login failed:", error);
    }
    setLoading(false);
  };

  // New function to handle MetaMask login
  const handleMetaMaskLogin = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      // Handle user login with the address
      setUser({ address });
    } else {
      console.error("MetaMask is not installed");
    }
  };

  // New function to handle WalletConnect login
  const handleWalletConnectLogin = async () => {
    const provider = new WalletConnectProvider({
      infuraId: "3ae7c665923a4007a325c5e1c25f203c",
    });
    await provider.enable();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    // Handle user login with the address
    setUser({ address });
  };

  return (
    <div className="max-w-md p-4 mx-auto bg-white shadow-lg rounded-xl">
      {/* <h2 className="mb-4 text-center h-[20px] text-2xl font-bold font-ibm-plex-sans">Log in or Sign up</h2> */}
      <form onSubmit={handleLogin} className=" p-6 h-[400px] w-auto rounded-lg ">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 mb-3  border rounded-lg outline-none focus:border-blue-500 transition-transform transform hover:scale-105"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
        >
          {loading ? "Logging in..." : "continue"}
        </button>
        <div className="flex color items-center justify-center">  
        <br className="text-gray-500"/> OR
        </div>
        
        <div className="mt-4">
          <button
            onClick={handleMetaMaskLogin}
            className="w-full px-4 py-2  border font-semibold text-black rounded-lg hover:border-[gray] flex items-center justify-center
            transition-transform transform hover:scale-105"
          >
            <Image src={MetaMask} alt="MetaMask logo" width={24} height={24} className="mr-2" />
            MetaMask
          </button>
          <button
            onClick={handleWalletConnectLogin}
            className="w-full px-4 py-2 mt-2 border  font-semibold text-black  rounded-lg hover:border-[gray] flex items-center justify-center transition-transform transform hover:scale-105"
          >
            <Image src={WalletConnect} alt="WalletConnect logo" width={24} height={24} className="mr-2" /> 
           WalletConnect
          </button>
          
        </div>
      </form>
      
    </div>
  );
}
