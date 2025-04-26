"use client"

import { ParentalControlSettings, parentalWebsiteSettings, DayOfWeek } from "@/app/lib/definitions";
import { updateParentalControlSettings } from "@/app/lib/userSettingActions";
import { useState } from "react";

interface parentalControlCardProps {
    settings: ParentalControlSettings;
    websites: parentalWebsiteSettings[];
}

export default function ParentalControlCard({settings, websites}: parentalControlCardProps) {
    const [recreationTime, setRecreationTime] = useState(settings.recreationSchedule);
    const [blockedApps, setBlockedApps] = useState(settings.blockedApps);

      // Toggle website access
  const toggleWebsite = (name: string) => {
    const updatedblockedApps = {...blockedApps};
    updatedblockedApps[name] = !updatedblockedApps[name];
    setBlockedApps(updatedblockedApps);
  };

  // Update recreation time
  const updateRecreationTime = (
    day: DayOfWeek,
    field: "start" | "end",
    value: string
  ) => {
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

    async function handleSaveChanges() {
        const newSettings: ParentalControlSettings = {
            blockedApps: blockedApps,
            recreationSchedule: recreationTime,
        };
        await updateParentalControlSettings(newSettings);
    }

    return (
        <>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {websites.map((website, _) => {
          const originalIndex = websites.findIndex(
            (w) => w.name === website.name
          );
          return (
            <div
              key={originalIndex}
              className="bg-gray-800 rounded border border-gray-700 p-4 flex justify-between items-center"
            >
              <div className="flex items-center">
                {website.icon ? (
                  <img
                    src={website.icon}
                    alt={`${website.name} icon`}
                    className="w-6 h-6 mr-3"
                  />
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
                    checked={blockedApps[website.name]}
                    onChange={() => toggleWebsite(website.name)}
                    aria-label={`Toggle ${website.name}`}
                  />
                  <div
                    className={`w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer ${
                        blockedApps[website.name] ? "peer-checked:bg-orange-600" : ""
                    } after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full`}
                  ></div>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="text-xl font-bold mt-8 mb-4 text-orange-400">
        Recreation Time
      </h2>
      <p className="mb-6 text-gray-300">
        Set a period for each day of the week during which restricted websites,
        apps, and games will be accessible.
      </p>

      <div className="mb-4 bg-gray-800 rounded border border-gray-700">
        <div className="p-6 space-y-4">
          {(Object.keys(recreationTime) as DayOfWeek[]).map((day, index) => (
            <div
              key={day}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                index < Object.keys(recreationTime).length - 1
                  ? "pb-4 border-b border-gray-700"
                  : ""
              }`}
            >
              <label className="text-gray-100 font-medium w-28">{day}</label>
              <div className="flex items-center space-x-4">
                <select
                  className="bg-gray-700 text-gray-100 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-orange-400"
                  value={recreationTime[day].start}
                  onChange={(e) =>
                    updateRecreationTime(day, "start", e.target.value)
                  }
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
                  onChange={(e) =>
                    updateRecreationTime(day, "end", e.target.value)
                  }
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
        <button
          onClick={handleSaveChanges} // Define handleSaveChanges function in your component
          className="px-6 py-2 bg-orange-600 text-white-900 font-semibold rounded hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300">
          Save Changes
        </button>
      </div>

        </>
    )
}