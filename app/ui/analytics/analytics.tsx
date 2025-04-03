"use client"

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function DNSAnalyticsDashboard() {
  // Sample data for area chart
  const queryData = [
    { name: '00:00', total: 10, blocked: 2 },
    { name: '03:00', total: 15, blocked: 1 },
    { name: '06:00', total: 20, blocked: 3 },
    { name: '09:00', total: 40, blocked: 4 },
    { name: '12:00', total: 30, blocked: 3 },
    { name: '15:00', total: 45, blocked: 5 },
    { name: '18:00', total: 60, blocked: 8 },
    { name: '21:00', total: 100, blocked: 15 },
    { name: '23:00', total: 70, blocked: 10 },
  ];

  // Sample data for domains
  const resolvedDomains = [
    { domain: 'youtube.com', count: 110, icon: '📺' },
    { domain: 'facebook.com', count: 77, icon: '📘' },
    { domain: 'www.gstatic.com', count: 56, icon: '🔍' },
    { domain: 'example.com', count: 53, icon: '🔍' },
    { domain: 'go-updater.brave.com', count: 20, icon: '🛡️' },
    { domain: 'version.bind', count: 19, icon: '🔍' },
  ];

  const blockedDomains = [
    { domain: 'google.com', count: 43, icon: '🔍' },
    { domain: 'www.google.com', count: 17, icon: '🔍' },
    { domain: 'www.youtube.com', count: 12, icon: '📺' },
    { domain: 'variations.brave.com', count: 8, icon: '🛡️' },
    { domain: 'gemini.google.com', count: 4, icon: '💎' },
    { domain: 'translate.google.com', count: 3, icon: '🔤' },
  ];

  // Statistic card component
  type StatCardProps = {
    value: string;
    label: string;
    color: string;
  };

  const StatCard = ({ value, label, color }: StatCardProps) => (
    <div className="bg-gray-800 rounded border border-gray-700 p-6 flex flex-col items-center justify-center">
      <div className={`text-4xl font-bold mb-1 ${color}`}>{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );

  // Domain row component
  type DomainRowProps = {
    domain: string;
    count: number;
    icon: string;
    isBlocked: boolean;
  };

  const DomainRow = ({ domain, count, icon, isBlocked }: DomainRowProps) => (
    <div className={`flex items-center justify-between py-3 px-4 border-b border-gray-700 ${isBlocked ? 'border-l-4 border-l-red-500' : ''}`}>
      <div className="flex items-center">
        <span className="mr-2">{icon}</span>
        <span className="text-gray-200">{domain}</span>
      </div>
      <div className="text-gray-400">{count}</div>
    </div>
  );

  return (
    <div className="p-6 text-gray-100">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard value="840" label="queries" color="text-white" />
        <StatCard value="103" label="blocked queries" color="text-red-500" />
        <StatCard value="12.26%" label="of blocked queries" color="text-gray-400" />
      </div>

      {/* Queries Chart */}
      <div className="bg-gray-800 rounded border border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Queries</h2>
        <p className="text-gray-400 mb-4 text-sm">Evolution of queries over time.</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={queryData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} stroke="#4b5563" />
              <YAxis tick={{ fill: '#9ca3af' }} stroke="#4b5563" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }} />
              <Area type="monotone" dataKey="total" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTotal)" />
              <Area type="monotone" dataKey="blocked" stroke="#ef4444" fillOpacity={1} fill="url(#colorBlocked)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Domains Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resolved Domains */}
        <div className="bg-gray-800 rounded border border-gray-700">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">Resolved Domains</h2>
            <p className="text-gray-400 text-sm">
              Domains that resolved without being blocked by any setting or because they were manually allowed.
            </p>
          </div>
          <div>
            {resolvedDomains.map((item, index) => (
              <DomainRow 
                key={index} 
                domain={item.domain} 
                count={item.count} 
                icon={item.icon} 
                isBlocked={false} 
              />
            ))}
          </div>
        </div>

        {/* Blocked Domains */}
        <div className="bg-gray-800 rounded border border-gray-700">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">Blocked Domains</h2>
            <p className="text-gray-400 text-sm">
              Domains blocked by a Security, Privacy and/or Parental Control setting or because they were manually denied.
            </p>
          </div>
          <div>
            {blockedDomains.map((item, index) => (
              <DomainRow 
                key={index} 
                domain={item.domain} 
                count={item.count} 
                icon={item.icon} 
                isBlocked={true} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}