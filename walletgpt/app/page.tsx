"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [wallet, setWallet] = useState("");
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-xl space-y-6">
        <h1 className="text-5xl font-bold">
          WalletGPT
        </h1>

        <p>
          Chat with any Solana wallet.
        </p>

        <input
          className="w-full border p-4 rounded-lg"
          placeholder="Enter wallet address"
          value={wallet}
          onChange={(e) =>
            setWallet(e.target.value)
          }
        />

        <button
          className="w-full bg-black text-white p-4 rounded-lg"
          onClick={() =>
            router.push(`/analyze/${wallet}`)
          }
        >
          Analyze Wallet
        </button>
      </div>
    </main>
  );
}