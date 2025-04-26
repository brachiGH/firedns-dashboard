"use client";
import { addDenyDomain, removeDenyDomain } from "@/app/lib/userSettingActions";
import React, { useState } from "react";

interface DenyListProp {
  DenyList: string[]
}

export default function Denylist({DenyList}: DenyListProp) {
  const [domains, setDomains] = useState<string[]>(DenyList);
  const [newDomain, setNewDomain] = useState("");

  const addDomain = async () => {
    if (newDomain.trim() && !domains.includes(newDomain)) {
      setDomains([...domains, newDomain]);
      setNewDomain("");
      await addDenyDomain(newDomain);
    }
  };

  const removeDomain = async (domain: string) => {
    setDomains(domains.filter((d) => d !== domain));
    await removeDenyDomain(domain);
  };

  return (
    <div className="text-gray-100 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-orange-400">Denylist</h1>
      <p className="mb-6 text-gray-300">
        Denying a domain will automatically deny all its subdomains.
      </p>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Add a domain..."
            className="w-full p-5 bg-gray-800 border border-gray-700 rounded text-gray-100 focus:outline-none focus:border-orange-400"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
          />
          <button
            className="absolute right-3 top-3 px-4 py-2 bg-orange-600 text-white font-semibold rounded hover:bg-orange-500 focus:outline-none"
            onClick={addDomain}
          >
            Add
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {domains.length === 0 ? (
          <p className="text-gray-300">No domains yet.</p>
        ) : (
          domains.map((domain, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded border border-gray-700 p-4 flex justify-between items-center"
            >
              <span className="text-gray-100">{domain}</span>
              <button
                className="text-gray-400 hover:text-red-500"
                onClick={() => removeDomain(domain)}
                aria-label={`Remove ${domain}`}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}