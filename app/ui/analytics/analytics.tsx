"use server"

import { getUserAnalytics } from '@/app/lib/userAnalytics'; // Import the fetch function
import AnalyticsLogsGraph from "@/app/ui/analytics/analyticsLogsGraph"

export default async function DNSAnalyticsDashboard() {
  // Fetch analytics data from the backend
  const analyticsData = await getUserAnalytics();

  // Handle loading or error state
  if (!analyticsData) {
    return (
      <div className="p-6 text-gray-100 flex justify-center items-center h-screen">
        <p>Loading analytics data or failed to fetch...</p>
        {/* You could add a spinner here */}
      </div>
    );
  }

  // Extract data from the response
  const {
    totalQueries,
    blockedQueries,
    blockedPercent,
    queryChartData,
    resolvedDomains,
    blockedDomains,
  } = analyticsData;

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
    isBlocked: boolean;
  };

  const DomainRow = ({ domain, count, isBlocked }: DomainRowProps) => (
    <div className={`flex items-center justify-between py-3 px-4 border-b border-gray-700 ${isBlocked ? 'border-l-4 border-l-red-500' : ''}`}>
      <div className="flex items-center">
        <span className="mr-2">🌐</span>
        <span className="text-gray-200">{domain}</span>
      </div>
      <div className="text-gray-400">{count}</div>
    </div>
  );

  return (
    <div className="p-6 text-gray-100">
      {/* Stats Cards - Use fetched data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard value={totalQueries.toLocaleString()} label="queries" color="text-white" />
        <StatCard value={blockedQueries.toLocaleString()} label="blocked queries" color="text-red-500" />
        <StatCard value={`${blockedPercent.toFixed(2)}%`} label="of blocked queries" color="text-gray-400" />
      </div>

      {/* Queriest* Chart - Use fetched data */}
      <AnalyticsLogsGraph queryChartData={queryChartData} />
      

      {/* Domains Lists - Use fetched data */}
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
            {resolvedDomains.length > 0 ? (
              resolvedDomains.map((item, index) => (
                <DomainRow
                  key={`resolved-${index}-${item.domain}`} // Use a more unique key
                  domain={item.domain}
                  count={item.count}
                  isBlocked={false}
                />
              ))
            ) : (
              <p className="p-4 text-gray-500">No resolved domains data available.</p>
            )}
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
            {blockedDomains.length > 0 ? (
              blockedDomains.map((item, index) => (
                <DomainRow
                  key={`blocked-${index}-${item.domain}`} // Use a more unique key
                  domain={item.domain}
                  count={item.count}
                  isBlocked={true}
                />
              ))
            ) : (
              <p className="p-4 text-gray-500">No blocked domains data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}