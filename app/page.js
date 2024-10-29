'use client'

import { useState, useEffect } from "react";
import AuthForm from "./components/auth";
import { magic } from "./lib/magic";
import './globals.css'

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const isLoggedIn = await magic.user.isLoggedIn();
        if (isLoggedIn) {
          const userMetadata = await magic.user.getMetadata();
          setUser(userMetadata);
        }
      } catch (error) {
        console.error("Failed to check login status:", error);
      }
    };
    checkUserLoggedIn();
  }, []);

  const handleLogout = async () => {
    await magic.user.logout();
    setUser(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {!user ? (
        <AuthForm setUser={setUser} />
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Welcome, {user.email}</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 mt-4 font-semibold text-white bg-red-500 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
