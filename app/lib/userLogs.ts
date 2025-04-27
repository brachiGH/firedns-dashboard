"use server"

import { auth } from "@/auth";
import { BackendLogEntry } from "@/app/lib/definitions"; // Adjust import path if needed

// Fetch user DNS query logs from the backend
export async function getUserLogs(): Promise<BackendLogEntry[] | null> {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        console.error("User ID not found in session for fetching logs.");
        return null;
    }

    // *** IMPORTANT: Define your actual backend endpoint for logs ***
    // This is a placeholder URL. Replace with your actual API endpoint.
    const apiUrl = process.env.NEXT_PUBLIC_SETTINGS_API_URL || "http://localhost:8080";
    const url = `${apiUrl}/logs/${userId}`; // Example endpoint

    const fetchOptions: RequestInit = {
        method: 'GET',
        cache: 'no-store', // Ensure fresh logs
    };

    try {
        console.log(`Fetching user logs from: ${url}`);
        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Error fetching user logs: ${response.status} ${response.statusText}`, errorBody);
            return null; // Indicate fetch/server error
        }

        const logData: BackendLogEntry[] = await response.json();
        console.log(`Successfully fetched ${logData.length} user log entries.`);
        // Optional: Sort logs by timestamp descending if backend doesn't guarantee order
        // logData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        return logData;

    } catch (error) {
        console.error(`Failed to execute fetch request to ${url}:`, error);
        return null; // Indicate failure
    }
}