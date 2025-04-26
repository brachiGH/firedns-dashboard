"use server";
import { getPrivacySettings } from "@/app/lib/userSettingActions"; // Adjust import path as needed
import PrivacySettingsCards from "@/app/ui/dns-settings/components/PrivacySettingsCards";
import { privacySettings } from "@/app/lib/definitions";

/**
 * This page lists the available blocklists for filtering ads and trackers.
 * Users can view details about each blocklist and manage them.
 */
export default async function Blocklists() {
  let settings = await getPrivacySettings();

  if (settings == null) {
    settings = {
      AdGuardMobileAdsFilter: false,
      AdAway: false,
      HageziMultiPro: false,
      GoodbyeAds: false,
      HostsVN: false,
      NextDNSAdsTrackers: false,
    };
  }

  console.log("ddd", settings);

  // Blocklists data
  const blocklists: privacySettings[] = [
    {
      title: "AdGuard Mobile Ads filter",
      description:
        "Filter that blocks ads on mobile devices. Contains all known mobile ad networks.",
      link: "https://kb.adguard.com/general/adguard-ad-filters#mobile-ads-filter",
      entries: "896 entries",
      updated: "Updated 13 hours ago",
      setting: "AdGuardMobileAdsFilter",
    },
    {
      title: "AdAway",
      description: "Blocking mobile ad providers and some analytics providers.",
      link: "https://github.com/AdAway/adaway.github.io",
      entries: "6,541 entries",
      updated: "Updated 2 years ago",
      setting: "AdAway",
    },
    {
      title: "HaGeZi - Multi PRO++",
      description:
        "Sweeper - Aggressive cleans the Internet and protects your privacy! Blocks Ads, Affiliate, Tracking, Metrics, Telemetry, Phishing, Malware, Scam, Fake, Coins and other Crap.",
      link: "https://github.com/hagezi/dns-blocklists",
      entries: "300,950 entries",
      updated: "Updated 7 hours ago",
      setting: "HageziMultiPro",
    },
    {
      title: "Goodbye Ads",
      description: "Specially Designed for Mobile Ad Protection.",
      link: "https://github.com/jerryn70/GoodbyeAds",
      entries: "277,778 entries",
      updated: "Updated 4 months ago",
      setting: "GoodbyeAds",
    },
    {
      title: "hostsVN",
      description:
        "Hosts block ads of Vietnamese - Hosts chặn quảng cáo của người Việt.",
      link: "https://github.com/bigdargon/hostsVN",
      entries: "18,387 entries",
      updated: "Updated 19 hours ago",
      setting: "HostsVN",
    },
    {
      title: "NextDNS Ads & Trackers Blocklist",
      description:
        "A comprehensive blocklist to block ads & trackers in all countries. This is the recommended starter blocklist.",
      link: "https://github.com/nextdns/metadata",
      entries: "132,773 entries",
      updated: "Updated a day ago",
      setting: "NextDNSAdsTrackers",
    },
  ];

  return (
    <div className="p-6 text-gray-100 max-w-4xxl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-orange-400">Blocklists</h1>
      <p className="mb-4 text-gray-300">
        Block ads & trackers using the most popular blocklists available — all
        updated in real-time.
      </p>
      <div className="space-y-4">
        <PrivacySettingsCards blocklists={blocklists} settings={settings} />
      </div>
    </div>
  );
}
