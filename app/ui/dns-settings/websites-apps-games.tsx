"use server";
import { parentalWebsiteSettings } from "@/app/lib/definitions";
import { getParentalControlSettings } from "@/app/lib/userSettingActions";
import ParentalControlCard from "./components/ParentalControlCard";

/**
 * This page allows parents to restrict their children's access to specific websites, apps, and games.
 * Parents can toggle access and configure recreation time settings.
 */
export default async function WebsitesAppsGames() {
  let settings = await getParentalControlSettings();

  if (settings == null) {
    settings = {
      blockedApps: {
        TikTok: false,
        Tinder: false,
        Snapchat: false,
        Instagram: false,
        Facebook: false,
        Twitter: false,
        VK: false,
        Roblox: false,
        Tumblr: false,
        Fortnite: false,
        YouTube: false,
        Twitch: false,
        Reddit: false,
        Messenger: false,
        "League of Legends": false,
        Telegram: false,
        Discord: false,
        Minecraft: false,
        Pinterest: false,
        BeReal: false,
        Hulu: false,
        Steam: false,
        Netflix: false,
        WhatsApp: false,
        "PlayStation Network": false,
        Mastodon: false,
        eBay: false,
        "HBO Max": false,
        Signal: false,
        Spotify: false,
        Zoom: false,
        Amazon: false,
        ChatGPT: false,
      },
      recreationSchedule: {
        Monday: { start: "12:00 PM", end: "6:30 PM" },
        Tuesday: { start: "12:00 PM", end: "6:30 PM" },
        Wednesday: { start: "12:00 PM", end: "6:30 PM" },
        Thursday: { start: "12:00 PM", end: "6:30 PM" },
        Friday: { start: "12:00 PM", end: "6:30 PM" },
        Saturday: { start: "12:00 PM", end: "9:30 PM" }, // Example different weekend time
        Sunday: { start: "12:00 PM", end: "9:30 PM" }, // Example different weekend time
      },
    };
  }

  // Initial state for toggles with icon URLs (replace with actual URLs)
  const websites: parentalWebsiteSettings[] = [
    { name: "TikTok", icon: "/icons/tiktok.png" },
    { name: "Tinder", icon: "/icons/tinder.png" },
    { name: "Snapchat", icon: "/icons/snapchat.png" },
    { name: "Instagram", icon: "/icons/instagram.png" },
    { name: "Facebook", icon: "/icons/facebook.png" },
    { name: "Twitter", icon: "/icons/twitter.png" },
    { name: "VK", icon: "/icons/vk.png" },
    { name: "Roblox", icon: "/icons/roblox.png" },
    { name: "Tumblr", icon: "/icons/tumblr.png" },
    { name: "Fortnite", icon: "/icons/fortnite.png" },
    { name: "YouTube", icon: "/icons/youtube.png" },
    { name: "Twitch", icon: "/icons/twitch.png" },
    { name: "Reddit", icon: "/icons/reddit.png" },
    { name: "Messenger", icon: "/icons/messenger.png" },
    {
      name: "League of Legends",
      icon: "/icons/leagueoflegends.png",
    },
    { name: "Telegram", icon: "/icons/telegram.png" },
    { name: "Discord", icon: "/icons/discord.png" },
    { name: "Minecraft", icon: "/icons/minecraft.png" },
    { name: "Pinterest", icon: "/icons/pinterest.png" },
    { name: "BeReal", icon: "/icons/bereal.png" },
    { name: "Hulu", icon: "/icons/hulu.png" },
    { name: "Steam", icon: "/icons/steam.png" },
    { name: "Netflix", icon: "/icons/netflix.png" },
    { name: "WhatsApp", icon: "/icons/whatsapp.png" },
    {
      name: "PlayStation Network",

      icon: "/icons/playstationnetwork.png",
    },
    { name: "Mastodon", icon: "/icons/mastodon.png" },
    { name: "eBay", icon: "/icons/ebay.png" },
    { name: "HBO Max", icon: "/icons/hbomax.png" },
    { name: "Signal", icon: "/icons/signal.png" },
    { name: "Spotify", icon: "/icons/spotify.png" },
    { name: "Zoom", icon: "/icons/zoom.png" },
    { name: "Amazon", icon: "/icons/amazon.png" },
    { name: "ChatGPT", icon: "/icons/chatgpt.png" },
  ];

  return (
    <div className="text-gray-100 max-w-4xxl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-orange-400">
        Websites, Apps & Games
      </h1>
      <p className="mb-6 text-gray-300">
        Control which websites, apps, and games your child can access. Toggle
        the switch to allow or block access.
      </p>
      <ParentalControlCard websites={websites} settings={settings} />
    </div>
  );
}
