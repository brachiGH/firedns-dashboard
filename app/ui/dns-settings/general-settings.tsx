"use server"
import { getGeneralSettings } from '@/app/lib/userSettingActions'; // Adjust import path as needed
import SettingsCards from "@/app/ui/dns-settings/components/settingsCard"
import { securitySettings } from "@/app/lib/definitions"

/**
 * This page is for parents to configure their DNS settings.
 * It allows toggling various security features for better control.
 */
export default async function SecuritySettings() {

  let settings = await getGeneralSettings()

  if (settings == null) {
    settings = {
      ThreatIntelligence: false,
      GoogleSafeBrowsing: false,
      HomographProtection: false,
      TyposquattingProtection: false,
      BlockNewDomains: false,
      BlockDynamicDNS: false,
      BlockCSAM: false,
    }
  }

  // Security settings data using the defined SettingKey type
  const securitySettings: securitySettings[] = [
    {
      title: "Threat Intelligence Feeds",
      description: "Block domains known to distribute malware, launch phishing attacks and host command-and-control servers using a blend of the most reputable threat intelligence feeds — all updated in real-time.",
      setting: "ThreatIntelligence",
    },
    {
      title: "Google Safe Browsing",
      description: "Block malware and phishing domains using Google Safe Browsing — a technology that examines billions of URLs per day looking for unsafe websites. Unlike the version embedded in some browsers, this does not associate your public IP address to threats and does not allow bypassing the block.",
      setting: "GoogleSafeBrowsing",
    },
    {
      title: "IDN Homograph Attacks Protection",
      description: "Block domains that impersonate other domains by abusing the large character set made available with the arrival of Internationalized Domain Names (IDNs) — e.g. replacing the Latin letter \"e\" with the Cyrillic letter \"е\".",
      setting: "HomographProtection",
    },
    {
      title: "Typosquatting Protection",
      description: "Block domains registered by malicious actors that target users who incorrectly type a website address into their browser — e.g. gooogle.com instead of google.com.",
      setting: "TyposquattingProtection",
    },
    {
      title: "Block Newly Registered Domains (NRDs)",
      description: "Block domains registered less than 30 days ago. Those domains are known to be favored by threat actors to launch malicious campaigns.",
      setting: "BlockNewDomains",
    },
    {
      title: "Block Dynamic DNS Hostnames",
      description: "Dynamic DNS (or DDNS) services let malicious actors quickly set up hostnames for free and without any validation or identity verification. While legit DDNS hostnames are rarely accessed in every-day use, their malicious counterparts are heavily used in phishing campaigns — e.g. paypal‑login.duckdns.org.",
      setting: "BlockDynamicDNS",
    },
    {
      title: "Block Child Sexual Abuse Material",
      description: "Block domains hosting child sexual abuse material with the help of Project Arachnid, operated by the Canadian Centre for Child Protection. No information is transmitted back to Project Arachnid when a domain is blocked.",
      setting: "BlockCSAM",
    }
  ];

  return (
    <div className="text-gray-100 max-w-4xxl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-orange-400">Security Settings</h1>
      <SettingsCards securitySettings={securitySettings} settings={settings}/>
      
    </div>
  );
}