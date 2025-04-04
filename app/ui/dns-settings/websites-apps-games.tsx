"use client";
import React, { useState } from "react";

/**
 * This page allows parents to restrict their children's access to specific websites, apps, and games.
 * Parents can toggle access and configure recreation time settings.
 */
export default function WebsitesAppsGames() {
  // Website type definition
  type Website = {
    name: string;
    enabled: boolean;
    icon?: string; // Optional icon placeholder
  };

  // Day of the week type definition
  type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  
  // Time period type definition
  type TimePeriod = {
    start: string;
    end: string;
  };
  
  // Recreation time type definition
  type RecreationTimeType = {
    [key in DayOfWeek]: TimePeriod;
  };

  // Initial state for toggles with icon placeholders
  const [websites, setWebsites] = useState<Website[]>([
    { name: "TikTok", enabled: false, icon: "🎵" },
    { name: "Tinder", enabled: false, icon: "❤️" },
    { name: "Snapchat", enabled: false, icon: "👻" },
    { name: "Instagram", enabled: false, icon: "📸" },
    { name: "Facebook", enabled: false, icon: "👥" },
    { name: "Twitter", enabled: false, icon: "🐦" },
    { name: "VK", enabled: false, icon: "🌐" },
    { name: "9GAG", enabled: false, icon: "😂" },
    { name: "Roblox", enabled: true, icon: "🎮" },
    { name: "Tumblr", enabled: false, icon: "📝" },
    { name: "Fortnite", enabled: true, icon: "🔫" },
    { name: "YouTube", enabled: true, icon: "▶️" },
    { name: "Twitch", enabled: false, icon: "🎬" },
    { name: "Reddit", enabled: false, icon: "🤖" },
    { name: "Messenger", enabled: false, icon: "💬" },
    { name: "League of Legends", enabled: false, icon: "🏆" },
    { name: "Telegram", enabled: false, icon: "✈️" },
    { name: "Discord", enabled: false, icon: "🎧" },
    { name: "Dailymotion", enabled: false, icon: "📺" },
    { name: "Minecraft", enabled: false, icon: "⛏️" },
    { name: "Pinterest", enabled: false, icon: "📌" },
    { name: "BeReal", enabled: false, icon: "📱" },
    { name: "Blizzard", enabled: false, icon: "❄️" },
    { name: "Hulu", enabled: false, icon: "🎭" },
    { name: "Imgur", enabled: false, icon: "🖼️" },
    { name: "Steam", enabled: false, icon: "🎲" },
    { name: "Xbox Live", enabled: false, icon: "🎯" },
    { name: "Skype", enabled: false, icon: "☁️" },
    { name: "Netflix", enabled: false, icon: "🍿" },
    { name: "Vimeo", enabled: false, icon: "🎞️" },
    { name: "WhatsApp", enabled: false, icon: "📱" },
    { name: "Disney+", enabled: false, icon: "🏰" },
    { name: "PlayStation Network", enabled: false, icon: "🕹️" },
    { name: "Mastodon", enabled: false, icon: "🐘" },
    { name: "Prime Video", enabled: false, icon: "📦" },
    { name: "eBay", enabled: false, icon: "🛒" },
    { name: "HBO Max", enabled: false, icon: "📽️" },
    { name: "Signal", enabled: false, icon: "🔒" },
    { name: "Spotify", enabled: false, icon: "🎧" },
    { name: "Google Chat", enabled: false, icon: "💬" },
    { name: "Zoom", enabled: false, icon: "🔍" },
    { name: "Amazon", enabled: false, icon: "🛍️" },
    { name: "ChatGPT", enabled: false, icon: "🤖" },
  ]);

  // Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const filteredWebsites = websites.filter(website => 
    website.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Recreation time state
  const [recreationTime, setRecreationTime] = useState<RecreationTimeType>({
    Monday: { start: "12:00", end: "18:30" },
    Tuesday: { start: "12:00", end: "18:30" },
    Wednesday: { start: "12:00", end: "18:30" },
    Thursday: { start: "12:00", end: "18:30" },
    Friday: { start: "12:00", end: "18:30" },
    Saturday: { start: "12:00", end: "09:30" },
    Sunday: { start: "12:00", end: "09:30" },
  });

  // Toggle website access
  const toggleWebsite = (index: number) => {
    const updatedWebsites = [...websites];
    updatedWebsites[index].enabled = !updatedWebsites[index].enabled;
    setWebsites(updatedWebsites);
  };

  // Remove website from list
  const removeWebsite = (index: number) => {
    const updatedWebsites = [...websites];
    updatedWebsites.splice(index, 1);
    setWebsites(updatedWebsites);
  };

  // Update recreation time
  const updateRecreationTime = (day: DayOfWeek, field: "start" | "end", value: string) => {
    setRecreationTime({
      ...recreationTime,
      [day]: {
        ...recreationTime[day],
        [field]: value,
      },
    });
  };

  // Generate time options for select dropdowns
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of ["00", "30"]) {
        const hourFormatted = hour.toString().padStart(2, "0");
        options.push(`${hourFormatted}:${minute}`);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Function to get placeholder icon based on first letter if no icon provided
  const getDefaultIcon = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="text-gray-100 max-w-4xxl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-orange-400">Websites, Apps & Games</h1>
      <p className="mb-6 text-gray-300">
        Control which websites, apps, and games your child can access. Toggle the switch to allow or block access.
      </p>
      
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a website, app or game..."
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-gray-100 focus:outline-none focus:border-orange-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute right-3 top-3 w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {filteredWebsites.map((website, index) => {
          const originalIndex = websites.findIndex(w => w.name === website.name);
          return (
            <div
              key={originalIndex}
              className="bg-gray-800 rounded border border-gray-700 p-4 flex justify-between items-center"
            >
              <div className="flex items-center">
                {website.icon ? (
                  <span className="mr-3 text-xl" aria-hidden="true">{website.icon}</span>
                ) : (
                  <div className="w-8 h-8 mr-3 rounded-full bg-gray-600 flex items-center justify-center text-sm font-semibold">
                    {getDefaultIcon(website.name)}
                  </div>
                )}
                <span className="text-gray-100">{website.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={website.enabled}
                    onChange={() => toggleWebsite(originalIndex)}
                    aria-label={`Toggle ${website.name}`}
                  />
                  <div
                    className={`w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer ${
                      website.enabled ? "peer-checked:bg-orange-600" : ""
                    } after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full`}
                  ></div>
                </label>
                <button 
                  className="text-gray-400 hover:text-red-500"
                  onClick={() => removeWebsite(originalIndex)}
                  aria-label={`Remove ${website.name}`}
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredWebsites.length === 0 && (
        <div className="bg-gray-800 rounded border border-gray-700 p-6 text-center mb-6">
          <p className="text-gray-300">No websites, apps or games found matching your search.</p>
        </div>
      )}

      <h2 className="text-xl font-bold mt-8 mb-4 text-orange-400">Recreation Time</h2>
      <p className="mb-6 text-gray-300">
        Set a period for each day of the week during which restricted websites, apps, and games will be accessible.
      </p>
      
      <div className="mb-4 bg-gray-800 rounded border border-gray-700">
        <div className="p-6 space-y-4">
          {(Object.keys(recreationTime) as DayOfWeek[]).map((day, index) => (
            <div key={day} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              index < Object.keys(recreationTime).length - 1 ? "pb-4 border-b border-gray-700" : ""
            }`}>
              <label className="text-gray-100 font-medium w-28">{day}</label>
              <div className="flex items-center space-x-4">
                <select
                  className="bg-gray-700 text-gray-100 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-orange-400"
                  value={recreationTime[day].start}
                  onChange={(e) => updateRecreationTime(day, "start", e.target.value)}
                  aria-label={`${day} start time`}
                >
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {formatTime(time)}
                    </option>
                  ))}
                </select>
                <span className="text-gray-300">to</span>
                <select
                  className="bg-gray-700 text-gray-100 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-orange-400"
                  value={recreationTime[day].end}
                  onChange={(e) => updateRecreationTime(day, "end", e.target.value)}
                  aria-label={`${day} end time`}
                >
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {formatTime(time)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 mb-8 flex justify-end">
        <button className="px-6 py-2 bg-orange-600 text-white-900 font-semibold rounded hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300">
          Save Changes
        </button>
      </div>
    </div>
  );
}