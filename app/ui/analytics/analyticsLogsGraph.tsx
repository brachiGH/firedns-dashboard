"use client"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import {AnalyticsChartDataPoint} from "@/app/lib/userAnalytics"

interface analyticsLogsGraphProps {
    queryChartData:AnalyticsChartDataPoint[];
}

export default function AnalyticsLogsGraph({queryChartData}:analyticsLogsGraphProps) {
    return (<div className="bg-gray-800 rounded border border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Queries</h2>
        <p className="text-gray-400 mb-4 text-sm">Evolution of queries over time.</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={queryChartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
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
      </div>)
}