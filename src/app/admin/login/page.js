"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, KeyRound, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to log in");
      }

      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-[80vh] flex items-center justify-center px-4 py-20 text-white">
      
      {/* Container Card */}
      <div className="relative glass-card border border-[#D4AF37]/20 rounded-xl p-8 max-w-sm w-full shadow-2xl relative">
        
        {/* Background Ambient glow */}
        <div className="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-[#D4AF37] opacity-[0.03] blur-2xl pointer-events-none"></div>

        <div className="text-center mb-8">
          <span className="p-3 bg-neutral-950 border border-[#D4AF37]/25 text-[#D4AF37] rounded-full inline-flex mb-3">
            <Lock className="h-6 w-6" />
          </span>
          <h1 className="font-serif text-2xl text-white tracking-wide">Studio Administration</h1>
          <p className="text-[10px] text-neutral-500 tracking-wider uppercase mt-1">
            Access secure store controls
          </p>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-500/20 text-red-400 p-3 rounded text-xs mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5 text-xs font-light">
          {/* Username */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-semibold mb-2">
              Administrator Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black border border-neutral-850 focus:border-[#D4AF37] outline-none text-xs rounded pl-10 pr-3 py-3 text-white transition"
                placeholder="Enter username"
              />
              <User className="h-4 w-4 text-neutral-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-semibold mb-2">
              Password Credentials
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-neutral-850 focus:border-[#D4AF37] outline-none text-xs rounded pl-10 pr-3 py-3 text-white transition font-mono"
                placeholder="••••••••"
              />
              <KeyRound className="h-4 w-4 text-neutral-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-gradient text-black font-semibold text-xs tracking-wider uppercase py-3 rounded hover:opacity-95 transition disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
          >
            {loading ? "Verifying..." : "Access Control"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-[10px] text-neutral-600 leading-normal">
            If this is a new deployment, make sure to seed the database first, then register the first administrator account via `/api/admin/setup`.
          </p>
        </div>

      </div>
    </div>
  );
}
