"use client"

import React from 'react';

export default function DNSQueryLog() {
  // Sample log data based on the image
  const logEntries: LogEntryProps[] = [
    { domain: 'chrack.com', time: '10:20:24 PM', status: 'allowed' },
    { domain: 'ssl.gstatic.com', time: '10:20:24 PM', status: 'system' },
    { domain: 'safebrowsing.googleapis.com', time: '10:20:24 PM', status: 'system' },
    { domain: 'www.googleapis.com', time: '10:20:24 PM', status: 'system' },
    { domain: 'accounts.google.com', time: '10:20:24 PM', status: 'blocked' },
    { domain: 'adservice.google.com', time: '10:20:24 PM', status: 'blocked' },
    { domain: 'static.xx.fbcdn.net', time: '10:20:24 PM', status: 'external' },
    { domain: 'play-lh.googleusercontent.com', time: '10:20:24 PM', status: 'cache' },
    { domain: 'res.cdn.office.net', time: '10:20:23 PM', status: 'allowed' },
    { domain: 'download.visualstudio.microsoft.com', time: '10:20:23 PM', status: 'system' },
    { domain: 'www.bing.com', time: '10:20:23 PM', status: 'blocked' },
    { domain: 'microsoft.com', time: '10:20:22 PM', status: 'allowed' },
    { domain: 'analytics.google.com', time: '10:20:22 PM', status: 'blocked' },
    { domain: 'cdn.shopify.com', time: '10:20:21 PM', status: 'external' },
    { domain: 'www.facebook.com', time: '10:20:21 PM', status: 'system' },
    { domain: 'fonts.gstatic.com', time: '10:20:21 PM', status: 'system' },
    { domain: 'collector.github.com', time: '10:20:21 PM', status: 'allowed' },
    { domain: 'update.googleapis.com', time: '10:20:21 PM', status: 'blocked' },
    { domain: 'github.io', time: '10:19:57 PM', status: 'cache' },
    { domain: 'i.ytimg.com', time: '10:19:57 PM', status: 'cache' },
    { domain: 'apis.google.com', time: '10:19:56 PM', status: 'system' },
    { domain: 'youtube.com', time: '10:19:56 PM', status: 'blocked' },
    { domain: 'github.com', time: '10:19:56 PM', status: 'allowed' },
    { domain: 'googletagmanager.com', time: '10:19:55 PM', status: 'blocked' },
  ];

  // Function to get domain icon
  const getDomainIcon = (domain: string) => {
    // Extract the base domain to determine icon
    const baseDomain = domain.split('.').slice(-2).join('.');
    const firstPart = domain.split('.')[0];
    
    // Common domains and their mappings
    if (domain.includes('google')) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
        </svg>
      );
    } else if (domain.includes('facebook') || domain.includes('fbcdn')) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    } else if (domain.includes('github')) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      );
    } else if (domain.includes('microsoft') || domain.includes('bing')) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
        </svg>
      );
    } else if (domain.includes('youtube') || domain.includes('ytimg')) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    } else if (domain.includes('shopify')) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.337 22.895l-.021-.041c-.324-.61-.217-1.307-.217-1.307s-1.786.175-2.413-.489c-.626-.664-.084-5.031-.084-5.031l3.074-.041s.532-2.994.637-3.119c.105-.125-3.108-.042-3.108-.042s.043-2.283.043-3.039c0-.757-.586-.976-.944-.976s-2.766.062-5.296.2c0 0 0 .921-1.139 1.04-1.138.118-1.804 1.02-1.93 2.1-.127 1.08-.21 2.266-.21 2.266l1.7.042s-.089 7.468.34 8.944c.429 1.475 1.968 1.754 3.278 1.817 1.31.062 1.34-.329 1.34-.329s-.445-.989.021-1.049c0 0 5.017.668 7.926.01zm1.12-18.246c.734-.235 1.79-.749 2.463-1.517 0 0-.84.175-2.083.368-1.243.194-1.875.097-1.875.097s-.274-.233-.485-.432c-.212-.198-1.07-1.152-2.339-1.152H11.77s-1.227.126-2.232 1.481c-1.005 1.355-.879 1.481-.879 1.481s-.79.028-1.558.223c-.767.193-1.891.707-2.424 1.984-.532 1.278-.589 1.692-.589 1.692L16.79.945s-.333 3.47-.333 3.704zm.272 1.324s-5.671-.603-5.959-.574c-.288.028-.424.54-.424.54s-2.127.129-3.107.305c-.98.175-1.193.499-1.193.499l9.926.042s.056-.448.757-.812z" />
        </svg>
      );
    } else {
      // Default globe icon for other domains
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      );
    }
  };

  // Get status color class
const getStatusColorClass = (status: 'allowed' | 'blocked' | 'system' | 'cache' | 'external'): string => {
    switch (status) {
        case 'allowed': return 'text-green-500';
        case 'blocked': return 'text-red-500';
        case 'system': return 'text-blue-500';
        case 'cache': return 'text-yellow-500';
        case 'external': return 'text-orange-500';
        default: return 'text-gray-500';
    }
};

  interface LogEntryProps {
    domain: string;
    time: string;
    status: 'allowed' | 'blocked' | 'system' | 'cache' | 'external';
  }

  const LogEntry: React.FC<LogEntryProps> = ({ domain, time, status }) => (
    <div className={`flex items-center justify-between py-2 px-4 border-b border-gray-700 hover:bg-gray-750 ${status === 'blocked' ? 'border-l-4 border-l-red-500' : ''}`}>
      <div className="flex items-center">
        <div className={`mr-3 ${getStatusColorClass(status)}`}>
          {getDomainIcon(domain)}
        </div>
        <span className="text-gray-200">{domain}</span>
      </div>
      <div className="flex items-center">
        {status === 'blocked' && (
          <span className="bg-red-500 text-xs px-2 py-1 rounded mr-3 text-white">Blocked</span>
        )}
        <span className="text-gray-500 text-sm">{time}</span>
      </div>
    </div>
  );

  // Search and filter bar component
  const SearchBar = () => (
    <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search DNS logs..." 
          className="w-full bg-gray-900 text-gray-300 border border-gray-700 rounded py-2 px-4 pl-10 focus:outline-none focus:border-blue-500" 
        />
        <div className="absolute left-3 top-2.5">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
    </div>
  );

  // Filters and stats bar
  const FilterBar = () => (
    <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center text-sm">
      <div className="flex gap-3">
        <span className="text-green-500 flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span>Allowed</span>
        </span>
        <span className="text-red-500 flex items-center gap-1">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          <span>Blocked</span>
        </span>
        <span className="text-blue-500 flex items-center gap-1">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          <span>System</span>
        </span>
        <span className="text-yellow-500 flex items-center gap-1">
          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
          <span>Cache</span>
        </span>
        <span className="text-orange-500 flex items-center gap-1">
          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
          <span>External</span>
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
      <div >
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