"use client" // Keep this if you need client-side interactivity (like search filtering later)

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { getUserLogs } from '@/app/lib/userLogs'; // Import the new action
import { BackendLogEntry } from '@/app/lib/definitions'; // Import the type

// Define props for the LogEntry component based on BackendLogEntry
interface LogEntryProps {
  domain: string;
  time: string; // Formatted time string
  status: 'allowed' | 'blocked';
}

// Helper function to format ISO timestamp
function formatLogTime(isoTimestamp: string): string {
  try {
    return new Date(isoTimestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true // Use AM/PM
    });
  } catch (e) {
    console.error("Error formatting time:", isoTimestamp, e);
    return "Invalid Date";
  }
}


export default function DNSQueryLog() {
  const [logEntries, setLogEntries] = useState<BackendLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      setError(null);
      const fetchedLogs = await getUserLogs();
      if (fetchedLogs) {
        setLogEntries(fetchedLogs);
      } else {
        setError("Failed to fetch logs.");
        setLogEntries([]); // Clear any previous logs on error
      }
      setIsLoading(false);
    };

    fetchLogs();
    // Optional: Add polling or real-time updates here if needed
    // const intervalId = setInterval(fetchLogs, 30000); // Fetch every 30 seconds
    // return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []); // Empty dependency array means this runs once on mount


  // Updated LogEntry component styling to match screenshot
  const LogEntry: React.FC<LogEntryProps> = ({ domain, time, status }) => (
    <div className={`flex items-center justify-between py-3 px-4 border-b border-gray-700 ${status === 'blocked' ? 'border-l-4 border-l-red-500' : ''} hover:bg-gray-800/50`}>
      <div className="flex items-center">
        <span className="text-gray-200 ml-1">{domain}</span>
      </div>
      <div className="flex items-center">
        {status === 'blocked' && (
          <span className="bg-red-500 text-xs px-2 py-1 rounded mr-3 text-white font-medium">Blocked</span>
        )}
        <span className="text-gray-400 text-sm">{time}</span>
      </div>
    </div>
  );

  // Search bar component - updated to match screenshot
  const SearchBar = () => (
    <div className="bg-gray-800/50 px-4 py-3 border-b border-gray-700/50">
      <div className="relative">
        <div className="absolute left-3 top-2.5">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search DNS logs..."
          className="w-full bg-gray-900/90 text-gray-300 border border-gray-700/50 rounded py-2 px-4 pl-10 focus:outline-none focus:border-blue-500"
          // Add onChange handler for search functionality later
        />
      </div>
    </div>
  );

  // Filters and stats bar - updated to match screenshot
  const FilterBar = () => (
    <div className="bg-gray-800/50 px-4 py-2 border-b border-gray-700/50 flex justify-between items-center text-sm">
      <div className="flex gap-4">
        {/* Add filter buttons/logic here later */}
        <span className="text-green-400 flex items-center gap-1.5">
          <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
          <span>Allowed</span>
        </span>
        <span className="text-red-400 flex items-center gap-1.5">
          <span className="w-2 h-2 bg-red-400 rounded-full inline-block"></span>
          <span>Blocked</span>
        </span>
      </div>
      <div className="text-gray-400">
        {/* Display dynamic count later */}
        {isLoading ? 'Loading...' : `Showing ${logEntries.length} entries`}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col">
      <SearchBar />
      <FilterBar />
      <div className="overflow-y-auto flex-grow"> {/* Use flex-grow for scrolling area */}
        {isLoading && <p className="p-4 text-center text-gray-400">Loading logs...</p>}
        {!isLoading && error && <p className="p-4 text-center text-red-500">{error}</p>}
        {!isLoading && !error && logEntries.length === 0 && <p className="p-4 text-center text-gray-500">No log entries found.</p>}
        {!isLoading && !error && logEntries.map((entry, index) => (
          <LogEntry
            key={`${index}-${entry.timestamp}-${entry.domain}`} // More robust key
            domain={entry.domain}
            time={formatLogTime(entry.timestamp)} // Format the time here
            status={entry.status}
          />
        ))}
      </div>
    </div>
  );
}