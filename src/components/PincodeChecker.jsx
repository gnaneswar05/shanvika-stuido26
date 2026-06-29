"use client";

import React, { useState } from "react";
import { Truck, CheckCircle2, AlertCircle } from "lucide-react";

export default function PincodeChecker({ allowedPincodesRule = "" }) {
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState("idle"); // idle, success, error
  const [message, setMessage] = useState("");

  const checkAvailability = (e) => {
    e.preventDefault();
    
    if (!pincode || pincode.trim().length !== 6 || isNaN(pincode)) {
      setStatus("error");
      setMessage("Please enter a valid 6-digit pincode.");
      return;
    }

    const cleanPin = pincode.trim();
    
    // Split the comma-separated rules
    const rules = allowedPincodesRule
      .split(",")
      .map((rule) => rule.trim())
      .filter((rule) => rule.length > 0);

    if (rules.length === 0) {
      // If no rules, assume delivery is available everywhere
      setStatus("success");
      setMessage("Delivery is available at your location.");
      return;
    }

    let isMatch = false;

    for (const rule of rules) {
      if (rule.endsWith("*")) {
        const prefix = rule.slice(0, -1);
        if (cleanPin.startsWith(prefix)) {
          isMatch = true;
          break;
        }
      } else {
        if (cleanPin === rule) {
          isMatch = true;
          break;
        }
      }
    }

    if (isMatch) {
      setStatus("success");
      setMessage("Eligible for free express delivery on orders above threshold!");
    } else {
      setStatus("error");
      setMessage("Sorry, standard delivery is not available for this pincode yet.");
    }
  };

  return (
    <div className="border border-neutral-900 bg-neutral-950 p-4 rounded-lg mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Truck className="h-4.5 w-4.5 text-[#D4AF37]" />
        <span className="text-xs uppercase tracking-wider font-medium text-neutral-300">
          Delivery Availability
        </span>
      </div>

      <form onSubmit={checkAvailability} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
          className="flex-1 bg-black border border-neutral-800 focus:border-[#D4AF37] outline-none text-xs rounded px-3 py-2 text-white font-mono placeholder:text-neutral-600 transition"
        />
        <button
          type="submit"
          className="bg-transparent hover:bg-[#D4AF37] border border-[#D4AF37] text-[#D4AF37] hover:text-black font-semibold text-xs tracking-wider uppercase px-4 py-2 rounded transition-colors"
        >
          Check
        </button>
      </form>

      {status === "success" && (
        <div className="flex items-start gap-2 mt-3 text-green-400 text-xs animate-fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-start gap-2 mt-3 text-red-400 text-xs animate-fade-in">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
