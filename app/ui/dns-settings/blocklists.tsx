"use client";
import React from "react";

/**
 * This page lists the available blocklists for filtering ads and trackers.
 * Users can view details about each blocklist and manage them.
 */
export default function Blocklists() {
  // Blocklists data
  const blocklists = [
    {
      title: "AdGuard Mobile Ads filter",
      description: "Filter that blocks ads on mobile devices. Contains all known mobile ad networks.",
      link: "https://kb.adguard.com/general/adguard-ad-filters#mobile-ads-filter",
      entries: "896 entries",
      updated: "Updated 13 hours ago",
    },
    {
      title: "AdAway",
      description: "Blocking mobile ad providers and some analytics providers.",
      link: "https://github.com/AdAway/adaway.github.io",
      entries: "6,541 entries",
      updated: "Updated 2 years ago",
    },
    {
      title: "HaGeZi - Multi PRO++",
      description: "Sweeper - Aggressive cleans the Internet and protects your privacy! Blocks Ads, Affiliate, Tracking, Metrics, Telemetry, Phishing, Malware, Scam, Fake, Coins and other Crap.",
      link: "https://github.com/hagezi/dns-blocklists",
      entries: "300,950 entries",
      updated: "Updated 7 hours ago",
    },
    {
      title: "Goodbye Ads",
      description: "Specially Designed for Mobile Ad Protection.",
      link: "https://github.com/jerryn70/GoodbyeAds",
      entries: "277,778 entries",
      updated: "Updated 4 months ago",
    },
    {
      title: "hostsVN",
      description: "Hosts block ads of Vietnamese - Hosts chặn quảng cáo của người Việt.",
      link: "https://github.com/bigdargon/hostsVN",
      entries: "18,387 entries",
      updated: "Updated 19 hours ago",
    },
    {
      title: "NextDNS Ads & Trackers Blocklist",
      description: "A comprehensive blocklist to block ads & trackers in all countries. This is the recommended starter blocklist.",
      link: "https://github.com/nextdns/metadata",
      entries: "132,773 entries",
      updated: "Updated a day ago",
    },
  ];

  return (
    <div className="p-6 text-gray-100 max-w-4xxl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-orange-400">Blocklists</h1>
      <p className="mb-4 text-gray-300">
        Block ads & trackers using the most popular blocklists available — all updated in real-time.
      </p>
      <div className="space-y-4">
        {blocklists.map((blocklist, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded border border-gray-700 p-4 flex justify-between items-start"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-100">{blocklist.title}</h2>
              <p className="text-gray-300 mt-1">{blocklist.description}</p>
              <a
                href={blocklist.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 text-sm mt-2 inline-block"
              >
                {blocklist.link}
              </a>
            </div>
            <div className="flex flex-col items-end space-y-2 ml-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
              <div className="text-right text-gray-400 text-sm">
                <p>{blocklist.entries}</p>
                <p>{blocklist.updated}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}