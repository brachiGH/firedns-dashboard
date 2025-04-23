"use client";

import { linkIpAddress } from "@/app/lib/userInfoActions";
import { ArrowPathIcon, XMarkIcon } from "@heroicons/react/24/outline"; // Import XMarkIcon
import { useState } from "react";

interface LinkedIpProps {
  currentIp: string | null | undefined;
  isLinked: boolean;
}

export default function LinkedIp({ currentIp, isLinked }: LinkedIpProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // State to manage notification visibility, separate from message content
  const [showNotification, setShowNotification] = useState(false);

  const handleLinkIp = async () => {
    setIsLoading(true);
    setMessage(null);
    setShowNotification(false); // Hide previous notification if any
    try {
      const res = await linkIpAddress();
      console.log(res);
      setMessage(res.message);
      setShowNotification(true); // Show notification on success/error
    } catch (error) {
      console.error("Failed to link IP:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred while linking the IP.";
      setMessage(errorMessage);
      setShowNotification(true); // Show notification on error
    } finally {
      setIsLoading(false);
    }
  };

  const closeNotification = () => {
    setShowNotification(false);
    // Optionally clear the message after animation/delay
    // setTimeout(() => setMessage(null), 300);
  };


  return (
    <div className="flex flex-col items-start space-y-1 text-sm text-gray-300 max-h-[75px]">
      <div className="flex items-center space-x-3">
        {!isLinked && (
          <button
            onClick={handleLinkIp}
            disabled={isLoading}
            className="flex items-center gap-1 text-red-400 hover:text-red-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Linking..." : "Link My IP"}
            {!isLoading && <ArrowPathIcon className="h-4 w-4" />}
          </button>
        )}
      </div>
      <span
        className={`px-3 py-1 bg-blackbg-300 rounded-md ${
          isLinked ? "text-green-400" : "text-yellow-400"
        }`}
      >
        IP: {isLinked ? currentIp : "Not Linked"}
      </span>

      {/* --- Notification Component --- */}
      {showNotification && message && (
        <div
          // Position fixed at the bottom center. Adjust 'bottom-4' as needed.
          // Use translate-x-1/2 for centering regardless of width.
          // Add z-index to ensure it's above other content.
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-auto max-w-sm p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg flex items-center justify-between space-x-4 animate-slide-up" // Added basic animation class (define below or use a library)
        >
          <p className="text-sm text-gray-200">{message}</p>
          <button
            onClick={closeNotification}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            aria-label="Close notification"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

    </div>
  );
}