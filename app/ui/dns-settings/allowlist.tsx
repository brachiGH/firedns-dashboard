"use client";
import React, { useState } from "react";

export default function Allowlist() {
  const [domains, setDomains] = useState<string[]>([]);
  const [newDomain, setNewDomain] = useState("");

  const addDomain = () => {
    if (newDomain.trim() && !domains.includes(newDomain)) {
      setDomains([...domains, newDomain]);
      setNewDomain("");
    }
  };

  const removeDomain = (domain: string) => {
    setDomains(domains.filter((d) => d !== domain));
  };

  return (
    <div className="text-gray-100 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-orange-400">Allowlist</h1>
      <p className="mb-6 text-gray-300">
        Allowing a domain will automatically allow all its subdomains. Allowing takes precedence over everything else, including security features.
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
            className="absolute right-3 top-3 px-4 py-2 bg-orange-400 text-white font-semibold rounded hover:bg-orange-500 focus:outline-none"
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