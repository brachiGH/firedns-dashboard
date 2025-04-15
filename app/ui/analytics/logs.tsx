"use client"

import React from 'react';

export default function DNSQueryLog() {
  // Sample log data based on the image
  const logEntries: LogEntryProps[] = [
    { domain: 'chrack.com', time: '10:20:24 PM', status: 'allowed' },
    { domain: 'ssl.gstatic.com', time: '10:20:24 PM', status: 'allowed' },
    { domain: 'safebrowsing.googleapis.com', time: '10:20:24 PM', status: 'allowed' },
    { domain: 'www.googleapis.com', time: '10:20:24 PM', status: 'allowed' },
    { domain: 'accounts.google.com', time: '10:20:24 PM', status: 'blocked' },
    { domain: 'adservice.google.com', time: '10:20:24 PM', status: 'blocked' },
    { domain: 'static.xx.fbcdn.net', time: '10:20:24 PM', status: 'allowed' },
    { domain: 'play-lh.googleusercontent.com', time: '10:20:24 PM', status: 'allowed' },
    { domain: 'res.cdn.office.net', time: '10:20:23 PM', status: 'allowed' },
    { domain: 'download.visualstudio.microsoft.com', time: '10:20:23 PM', status: 'allowed' },
    { domain: 'www.bing.com', time: '10:20:23 PM', status: 'blocked' },
    { domain: 'microsoft.com', time: '10:20:22 PM', status: 'allowed' },
    { domain: 'analytics.google.com', time: '10:20:22 PM', status: 'allowed' },
    { domain: 'cdn.shopify.com', time: '10:20:21 PM', status: 'allowed' },
    { domain: 'www.facebook.com', time: '10:20:21 PM', status: 'allowed' },
    { domain: 'fonts.gstatic.com', time: '10:20:21 PM', status: 'allowed' },
    { domain: 'collector.github.com', time: '10:20:21 PM', status: 'allowed' },
    { domain: 'update.googleapis.com', time: '10:20:21 PM', status: 'blocked' },
    { domain: 'github.io', time: '10:19:57 PM', status: 'allowed' },
    { domain: 'i.ytimg.com', time: '10:19:57 PM', status: 'allowed' },
    { domain: 'apis.google.com', time: '10:19:56 PM', status: 'allowed' },
    { domain: 'youtube.com', time: '10:19:56 PM', status: 'blocked' },
    { domain: 'github.com', time: '10:19:56 PM', status: 'allowed' },
    { domain: 'googletagmanager.com', time: '10:19:55 PM', status: 'blocked' },
  ];

  interface LogEntryProps {
    domain: string;
    time: string;
    status: 'allowed' | 'blocked';
  }

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
        />
      </div>
    </div>
  );

  // Filters and stats bar - updated to match screenshot
  const FilterBar = () => (
    <div className="bg-gray-800/50 px-4 py-2 border-b border-gray-700/50 flex justify-between items-center text-sm">
      <div className="flex gap-4">
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
        Today: 624 queries
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      <SearchBar />
      <FilterBar />
      <div className="overflow-y-auto max-h-[calc(100vh-120px)]">
        {logEntries.map((entry, index) => (
          <LogEntry
            key={index}
            domain={entry.domain}
            time={entry.time}
            status={entry.status}
          />
        ))}
      </div>
    </div>
  );
}