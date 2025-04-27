"use client";
import { updateGeneralSettings } from "@/app/lib/userSettingActions";
import { GeneralSettingsOptions, securitySettings } from "@/app/lib/definitions";
import { useState } from "react";

interface settingCardProp {
  securitySettings: securitySettings[];
  settings: GeneralSettingsOptions
}

export default function SettingsCards({ securitySettings, settings }: settingCardProp) {
  const [isEnabled, setIsEnabled] = useState(settings);

  // Function to handle toggle changes
  const handleToggle = async (setting:keyof GeneralSettingsOptions) => {
    const newIsEnabled = {
      ...isEnabled, // Copy existing state
      [setting]: !isEnabled[setting] // Toggle the specific setting
    };

    setIsEnabled(newIsEnabled);
    await updateGeneralSettings(newIsEnabled);
  };

  return (
    <>
      {securitySettings.map(({ title, description, setting }) => (
        <div
          className="mb-4 bg-gray-800 rounded border border-gray-700"
          key={setting}
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-2">
              {title}
            </h2>
            <p className="text-gray-300 mb-4">{description}</p>
          </div>
          <div className="px-6 py-3 border-t border-gray-700 flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isEnabled[setting]}
                onChange={async () => {
                  handleToggle(setting);
                }}
                aria-label={`Toggle ${title}`}
              />
              <div
                className={`w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer ${
                  isEnabled[setting] ? "peer-checked:bg-orange-600" : ""
                } after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full`}
              ></div>
              <span className="ml-3 text-sm font-medium text-gray-300">
                {isEnabled[setting] ? `Enable ${title}` : `Disable ${title}`}
              </span>
            </label>
          </div>
        </div>
      ))}
    </>
  );
}
