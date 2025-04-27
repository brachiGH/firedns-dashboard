"use server"

import { auth } from "@/auth";

// Define the structure for a single point in the chart data from the backend
export interface AnalyticsChartDataPoint {
  name: string;    // Time label (e.g., "00:00")
  total: number;   // Total queries in this bucket
  blocked: number; // Blocked queries in this bucket
}

// Define the structure for a domain count from the backend
interface AnalyticsDomainCount {
  domain: string;
  count: number;
}

// Define the overall structure of the analytics data returned by the backend API
// Keys match the Go struct JSON tags (camelCase)
export interface BackendAnalyticsResponse {
  totalQueries: number;
  blockedQueries: number;
  blockedPercent: number;
  queryChartData: AnalyticsChartDataPoint[];
  resolvedDomains: AnalyticsDomainCount[];
  blockedDomains: AnalyticsDomainCount[];
}

// Fetch user analytics data from the backend
export async function getUserAnalytics(): Promise<BackendAnalyticsResponse | null> {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        console.error("User ID not found in session.");
        return null;
    }

    // Assuming the analytics endpoint is served from the same base URL as settings
    // Adjust if you have a separate API URL for analytics
    const apiUrl = process.env.NEXT_PUBLIC_SETTINGS_API_URL || "http://localhost:8080";
    const url = `${apiUrl}/analytics/${userId}`;

    const fetchOptions: RequestInit = {
        method: 'GET',
        cache: 'no-store', // Ensure fresh data for analytics
    };

    try {
        console.log(`Fetching user analytics from: ${url}`);
        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Error fetching user analytics: ${response.status} ${response.statusText}`, errorBody);
            // Handle specific cases like 404 (no data yet) if needed,
            // although the Go handler returns an empty structure in that case.
            // Returning null indicates a fetch/server error here.
            return null;
        }

        const analyticsData: BackendAnalyticsResponse = await response.json();
        console.log("Successfully fetched user analytics:", analyticsData);
        return analyticsData;

    } catch (error) {
        console.error(`Failed to execute fetch request to ${url}:`, error);
        return null; // Indicate failure
    }
}