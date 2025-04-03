"use client";
import React, { useState } from 'react';

/**
 * This page is for parents to configure their DNS settings.
 * It allows toggling various security features for better control.
 */
export default function SecuritySettings() {
  // Initial state for toggle switches
  const [settings, setSettings] = useState({
    threatIntelligence: true,
    googleSafeBrowsing: true,
    homographProtection: true,
    typosquattingProtection: true,
    blockNewDomains: true,
    blockDynamicDNS: true,
    blockCSAM: true
  });

  // Function to handle toggle changes
  const handleToggle = (setting: keyof typeof settings) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  // Security setting component
  interface SecuritySettingProps {
    title: string;
    description: string;
    setting: keyof typeof settings;
  }

  const SecuritySetting: React.FC<SecuritySettingProps> = ({ title, description, setting }) => (
    <div className="mb-4 bg-gray-800 rounded border border-gray-700">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-2">{title}</h2>
        <p className="text-gray-300 mb-4">{description}</p>

      </div>
      <div className="px-6 py-3 border-t border-gray-700 flex items-center">
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer"
            checked={settings[setting]}
            onChange={() => handleToggle(setting)}
            aria-label={`Toggle ${title}`}
          />
          <div className={`w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer ${settings[setting] ? 'peer-checked:bg-orange-400' : ''} after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full`}></div>
          <span className="ml-3 text-sm font-medium text-gray-300">
            {settings[setting] ? `Disable ${title}` : `Enable ${title}`}
          </span>
        </label>
      </div>
    </div>
  );

  // Security settings data
  const securitySettings: { title: string; description: string; setting: keyof typeof settings }[] = [
    {
      title: "Threat Intelligence Feeds",
      description: "Block domains known to distribute malware, launch phishing attacks and host command-and-control servers using a blend of the most reputable threat intelligence feeds — all updated in real-time.",
      setting: "threatIntelligence"
    },
    {
      title: "Google Safe Browsing",
      description: "Block malware and phishing domains using Google Safe Browsing — a technology that examines billions of URLs per day looking for unsafe websites. Unlike the version embedded in some browsers, this does not associate your public IP address to threats and does not allow bypassing the block.",
      setting: "googleSafeBrowsing"
    },
    {
      title: "IDN Homograph Attacks Protection",
      description: "Block domains that impersonate other domains by abusing the large character set made available with the arrival of Internationalized Domain Names (IDNs) — e.g. replacing the Latin letter \"e\" with the Cyrillic letter \"е\".",
      setting: "homographProtection"
    },
    {
      title: "Typosquatting Protection",
      description: "Block domains registered by malicious actors that target users who incorrectly type a website address into their browser — e.g. gooogle.com instead of google.com.",
      setting: "typosquattingProtection"
    },
    {
      title: "Block Newly Registered Domains (NRDs)",
      description: "Block domains registered less than 30 days ago. Those domains are known to be favored by threat actors to launch malicious campaigns.",
      setting: "blockNewDomains"
    },
    {
      title: "Block Dynamic DNS Hostnames",
      description: "Dynamic DNS (or DDNS) services let malicious actors quickly set up hostnames for free and without any validation or identity verification. While legit DDNS hostnames are rarely accessed in every-day use, their malicious counterparts are heavily used in phishing campaigns — e.g. paypal‑login.duckdns.org.",
      setting: "blockDynamicDNS"
    },
    {
      title: "Block Child Sexual Abuse Material",
      description: "Block domains hosting child sexual abuse material with the help of Project Arachnid, operated by the Canadian Centre for Child Protection. No information is transmitted back to Project Arachnid when a domain is blocked.",
      setting: "blockCSAM"
    }
  ];

  return (
    <div className="text-gray-100 max-w-4xxl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-orange-400">Security Settings</h1>
      
      {securitySettings.map(({ title, description, setting }) => (
        <SecuritySetting
          key={setting}
          title={title}
          description={description}
          setting={setting}
        />
      ))}
    </div>
  );
}