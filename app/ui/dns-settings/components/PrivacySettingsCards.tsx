"use client";
import { updatePrivacySettings } from "@/app/lib/userSettingActions";
import { privacySettings, PrivacySettingsOptions } from "@/app/lib/definitions";
import { useState } from "react";

interface settingCardProp {
    blocklists: privacySettings[];
    settings: PrivacySettingsOptions
}

export default function PrivacySettingsCards({ blocklists, settings }: settingCardProp) {
  const [isEnabled, setIsEnabled] = useState(settings);

  // Function to handle toggle changes
  const handleToggle = async (setting:keyof PrivacySettingsOptions) => {
    const newIsEnabled = {
      ...isEnabled, // Copy existing state
      [setting]: !isEnabled[setting] // Toggle the specific setting
    };

    setIsEnabled(newIsEnabled);
    await updatePrivacySettings(newIsEnabled);
  };

  return (
    <>
      {blocklists.map((blocklist, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded border border-gray-700 p-4 flex justify-between items-start"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-100">
                  {blocklist.title}
                </h2>
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
                   <input
                type="checkbox"
                className="sr-only peer"
                checked={isEnabled[blocklist.setting]}
                onChange={async () => {
                  handleToggle(blocklist.setting);
                }}
                aria-label={`Toggle ${blocklist.title}`}
              />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
                <div className="text-right text-gray-400 text-sm">
                  <p>{blocklist.entries}</p>
                  <p>{blocklist.updated}</p>
                </div>
              </div>
            </div>
          ))}
    </>
  );
}
