"use server"
import { auth } from "@/auth";
// Ensure this import points to the updated definitions file with camelCase keys
// Assuming PrivacySettingsOptions is also defined in definitions.ts
import { GeneralSettingsOptions, PrivacySettingsOptions, ParentalControlSettings, TimeRange } from "@/app/lib/definitions"; // Add ParentalControlSettings

// Define the structure returned by the Go backend API for General Settings
// Updated keys to match Go struct JSON tags (camelCase)
interface BackendGeneralSettings {
    userId: string;
    threatIntelligence: boolean;
    googleSafeBrowsing: boolean;
    homographProtection: boolean;
    typosquattingProtection: boolean;
    blockNewDomains: boolean;
    blockDynamicDNS: boolean;
    blockCSAM: boolean;
}

// Define the structure returned by the Go backend API for Privacy Settings
// Keys match the Go struct JSON tags (camelCase)
interface BackendPrivacySettings {
    userId: string;
    adGuardMobileAdsFilter: boolean;
    adAway: boolean;
    hageziMultiPro: boolean;
    goodbyeAds: boolean;
    hostsVN: boolean;
    nextDNSAdsTrackers: boolean;
}

// Define the structure returned by the Go backend API for Parental Control Settings
// Keys match the Go struct JSON tags (camelCase)
interface BackendParentalControlSettings {
    userId: string;
    blockedApps: { [key: string]: boolean };        // Map of app/service name to blocked status
    recreationSchedule: { [key: string]: TimeRange }; // Map of day ("Monday", etc.) to TimeRange
}

// --- Deny List Actions ---

// Define the structure returned by the Go backend API for Deny List GET
interface BackendDenyListResponse {
    userId: string;
    domains: string[];
}

// Fetch deny list from the backend
export async function getDenyList(): Promise<string[] | null> {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        console.error("User ID not found in session.");
        return null;
    }

    const apiUrl = process.env.NEXT_PUBLIC_SETTINGS_API_URL || "http://localhost:8080";
    const url = `${apiUrl}/settings/denylist/${userId}`;

    const fetchOptions: RequestInit = {
        method: 'GET',
        cache: 'no-store', // Ensure fresh data
    };

    try {
        console.log(`Fetching deny list from: ${url}`);
        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Error fetching deny list: ${response.status} ${response.statusText}`, errorBody);
            // If no document exists, backend might return 404 or similar, but the GET handler returns empty list on ErrNoDocuments
            // So, we might still get a 200 OK with an empty list. Handle specific errors if needed.
            return []; // Return empty list on error or if not found
        }

        const result: BackendDenyListResponse = await response.json();
        console.log("Successfully fetched deny list:", result.domains);
        return result.domains || []; // Return domains or empty array if null/undefined

    } catch (error) {
        console.error(`Failed to execute fetch request to ${url}:`, error);
        return null; // Indicate failure
    }
}

// Add a domain to the deny list
export async function addDenyDomain(domain: string): Promise<boolean> {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        console.error("User ID not found in session.");
        return false;
    }
    if (!domain || domain.trim() === "") {
        console.error("Domain cannot be empty.");
        return false;
    }

    const apiUrl = process.env.NEXT_PUBLIC_SETTINGS_API_URL || "http://localhost:8080";
    const url = `${apiUrl}/settings/denylist/${userId}`;

    const backendPayload = {
        domain: domain.trim(),
    };

    const fetchOptions: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendPayload),
    };

    try {
        console.log(`Adding domain '${domain}' to deny list at: ${url}`);
        const response = await fetch(url, fetchOptions);

        // Backend returns 204 No Content on success
        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Error adding domain to deny list: ${response.status} ${response.statusText}`, errorBody);
            throw new Error(`Failed to add domain to deny list: ${response.status}`);
        }

        console.log(`Successfully added domain '${domain}' to deny list for user ${userId}`);
        return true;

    } catch (error) {
        console.error(`Failed to execute POST request to ${url}:`, error);
        return false;
    }
}

// Remove a domain from the deny list
export async function removeDenyDomain(domain: string): Promise<boolean> {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        console.error("User ID not found in session.");
        return false;
    }
    if (!domain || domain.trim() === "") {
        console.error("Domain cannot be empty.");
        return false;
    }

    const apiUrl = process.env.NEXT_PUBLIC_SETTINGS_API_URL || "http://localhost:8080";
    const url = `${apiUrl}/settings/denylist/${userId}`;

    const backendPayload = {
        domain: domain.trim(),
    };

    const fetchOptions: RequestInit = {
        method: 'DELETE', // Use DELETE method
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendPayload), // Send domain in the body
    };

    try {
        console.log(`Removing domain '${domain}' from deny list at: ${url}`);
        const response = await fetch(url, fetchOptions);

        // Backend returns 204 No Content on success
        if (!response.ok) {
            const errorBody = await response.text();
            // Handle 404 specifically if needed (domain or user not found)
            if (response.status === 404) {
                 console.warn(`Domain '${domain}' not found in deny list or user settings not found for user ${userId}.`);
                 // Consider returning true as the state is achieved (domain is not in the list)
                 return true;
            }
            console.error(`Error removing domain from deny list: ${response.status} ${response.statusText}`, errorBody);
            throw new Error(`Failed to remove domain from deny list: ${response.status}`);
        }

        console.log(`Successfully removed domain '${domain}' from deny list for user ${userId}`);
        return true;

    } catch (error) {
        console.error(`Failed to execute DELETE request to ${url}:`, error);
        return false;
    }
}


// --- Allow List Actions ---

// Define the structure returned by the Go backend API for Allow List GET
interface BackendAllowListResponse {
    userId: string;
    domains: string[];
}

// Fetch allow list from the backend
export async function getAllowList(): Promise<string[] | null> {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        console.error("User ID not found in session.");
        return null;
    }

    const apiUrl = process.env.NEXT_PUBLIC_SETTINGS_API_URL || "http://localhost:8080";
    const url = `${apiUrl}/settings/allowlist/${userId}`;

    const fetchOptions: RequestInit = {
        method: 'GET',
        cache: 'no-store', // Ensure fresh data
    };

    try {
        console.log(`Fetching allow list from: ${url}`);
        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Error fetching allow list: ${response.status} ${response.statusText}`, errorBody);
            return []; // Return empty list on error or if not found
        }

        const result: BackendAllowListResponse = await response.json();
        console.log("Successfully fetched allow list:", result.domains);
        return result.domains || []; // Return domains or empty array if null/undefined

    } catch (error) {
        console.error(`Failed to execute fetch request to ${url}:`, error);
        return null; // Indicate failure
    }
}

// Add a domain to the allow list
export async function addAllowDomain(domain: string): Promise<boolean> {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        console.error("User ID not found in session.");
        return false;
    }
     if (!domain || domain.trim() === "") {
        console.error("Domain cannot be empty.");
        return false;
    }

    const apiUrl = process.env.NEXT_PUBLIC_SETTINGS_API_URL || "http://localhost:8080";
    const url = `${apiUrl}/settings/allowlist/${userId}`;

    const backendPayload = {
        domain: domain.trim(),
    };

    const fetchOptions: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendPayload),
    };

    try {
        console.log(`Adding domain '${domain}' to allow list at: ${url}`);
        const response = await fetch(url, fetchOptions);

        // Backend returns 204 No Content on success
        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Error adding domain to allow list: ${response.status} ${response.statusText}`, errorBody);
            throw new Error(`Failed to add domain to allow list: ${response.status}`);
        }

        console.log(`Successfully added domain '${domain}' to allow list for user ${userId}`);
        return true;

    } catch (error) {
        console.error(`Failed to execute POST request to ${url}:`, error);
        return false;
    }
}

// Remove a domain from the allow list
export async function removeAllowDomain(domain: string): Promise<boolean> {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        console.error("User ID not found in session.");
        return false;
    }
     if (!domain || domain.trim() === "") {
        console.error("Domain cannot be empty.");
        return false;
    }

    const apiUrl = process.env.NEXT_PUBLIC_SETTINGS_API_URL || "http://localhost:8080";
    const url = `${apiUrl}/settings/allowlist/${userId}`;

    const backendPayload = {
        domain: domain.trim(),
    };

    const fetchOptions: RequestInit = {
        method: 'DELETE', // Use DELETE method
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendPayload), // Send domain in the body
    };

    try {
        console.log(`Removing domain '${domain}' from allow list at: ${url}`);
        const response = await fetch(url, fetchOptions);

        // Backend returns 204 No Content on success
        if (!response.ok) {
            const errorBody = await response.text();
             // Handle 404 specifically if needed (domain or user not found)
            if (response.status === 404) {
                 console.warn(`Domain '${domain}' not found in allow list or user settings not found for user ${userId}.`);
                 // Consider returning true as the state is achieved (domain is not in the list)
                 return true;
            }
            console.error(`Error removing domain from allow list: ${response.status} ${response.statusText}`, errorBody);
            throw new Error(`Failed to remove domain from allow list: ${response.status}`);
        }

        console.log(`Successfully removed domain '${domain}' from allow list for user ${userId}`);
        return true;

    } catch (error) {
        console.error(`Failed to execute DELETE request to ${url}:`, error);
        return false;
    }
}

// Fetch general settings from the backend
export async function getGeneralSettings(): Promise<GeneralSettingsOptions | null> {
      const session = await auth();
      const userId = session?.user?.id;

      if (!userId) {
        console.error("User ID not found in session.");
        return null;
      }

      const apiUrl = process.env.NEXT_PUBLIC_SETTINGS_API_URL || "http://localhost:8080";
      const url = `${apiUrl}/settings/general/${userId}`;

      const fetchOptions: RequestInit = {
          method: 'GET',
      };

      try {
        console.log(`Fetching general settings from: ${url}`);
        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Error fetching general settings: ${response.status} ${response.statusText}`, errorBody);
            throw new Error(`Failed to fetch general settings: ${response.status}`);
        }

        const settings: BackendGeneralSettings = await response.json();

        // Map BackendGeneralSettings to GeneralSettingsOptions (assuming PascalCase in frontend)
        const options: GeneralSettingsOptions = {
            ThreatIntelligence: settings.threatIntelligence,
            GoogleSafeBrowsing: settings.googleSafeBrowsing,
            HomographProtection: settings.homographProtection,
            TyposquattingProtection: settings.typosquattingProtection,
            BlockNewDomains: settings.blockNewDomains,
            BlockDynamicDNS: settings.blockDynamicDNS,
            BlockCSAM: settings.blockCSAM,
        };

        console.log("Successfully fetched general settings:", options);
        return options;

      } catch (error) {
        console.error(`Failed to execute fetch request to ${url}:`, error);
        return null;
      }
}

// Update general settings
export async function updateGeneralSettings(newSettings: GeneralSettingsOptions): Promise<boolean> {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        console.error("User ID not found in session.");
        return false;
    }

    const apiUrl = process.env.NEXT_PUBLIC_SETTINGS_API_URL || "http://localhost:8080";
    const url = `${apiUrl}/settings/general/${userId}`;

    // Map frontend GeneralSettingsOptions (PascalCase) to backend expected format (camelCase)
    const backendPayload: Omit<BackendGeneralSettings, 'userId'> = {
        threatIntelligence: newSettings.ThreatIntelligence,
        googleSafeBrowsing: newSettings.GoogleSafeBrowsing,
        homographProtection: newSettings.HomographProtection,
        typosquattingProtection: newSettings.TyposquattingProtection,
        blockNewDomains: newSettings.BlockNewDomains,
        blockDynamicDNS: newSettings.BlockDynamicDNS,
        blockCSAM: newSettings.BlockCSAM,
    };

    const fetchOptions: RequestInit = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendPayload), // Send the mapped payload
    };

    try {
        console.log(`Updating general settings at: ${url}`);
        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Error updating general settings: ${response.status} ${response.statusText}`, errorBody);
            throw new Error(`Failed to update general settings: ${response.status}`);
        }

        console.log(`Successfully updated general settings for user ${userId}`);
        return true;

    } catch (error) {
        console.error(`Failed to execute PATCH request to ${url}:`, error);
        return false;
    }
}


// Fetch privacy settings from the backend
export async function getPrivacySettings(): Promise<PrivacySettingsOptions | null> {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        console.error("User ID not found in session.");
        return null;
    }

    const apiUrl = process.env.NEXT_PUBLIC_SETTINGS_API_URL || "http://localhost:8080";
    const url = `${apiUrl}/settings/privacy/${userId}`; // Use the privacy endpoint

    const fetchOptions: RequestInit = {
        method: 'GET',
    };

    try {
        console.log(`Fetching privacy settings from: ${url}`);
        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Error fetching privacy settings: ${response.status} ${response.statusText}`, errorBody);
            throw new Error(`Failed to fetch privacy settings: ${response.status}`);
        }

        const settings: BackendPrivacySettings = await response.json();

        // Map BackendPrivacySettings to PrivacySettingsOptions (assuming PascalCase in frontend)
        const options: PrivacySettingsOptions = {
            AdGuardMobileAdsFilter: settings.adGuardMobileAdsFilter,
            AdAway: settings.adAway,
            HageziMultiPro: settings.hageziMultiPro,
            GoodbyeAds: settings.goodbyeAds,
            HostsVN: settings.hostsVN,
            NextDNSAdsTrackers: settings.nextDNSAdsTrackers,
        };

        console.log("Successfully fetched privacy settings:", options);
        return options;

    } catch (error) {
        console.error(`Failed to execute fetch request to ${url}:`, error);
        return null;
    }
}

// Update privacy settings
export async function updatePrivacySettings(newSettings: PrivacySettingsOptions): Promise<boolean> {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        console.error("User ID not found in session.");
        return false;
    }

    const apiUrl = process.env.NEXT_PUBLIC_SETTINGS_API_URL || "http://localhost:8080";
    const url = `${apiUrl}/settings/privacy/${userId}`; // Use the privacy endpoint

    // Map frontend PrivacySettingsOptions (PascalCase) to backend expected format (camelCase)
    const backendPayload: Omit<BackendPrivacySettings, 'userId'> = {
        adGuardMobileAdsFilter: newSettings.AdGuardMobileAdsFilter,
        adAway: newSettings.AdAway,
        hageziMultiPro: newSettings.HageziMultiPro,
        goodbyeAds: newSettings.GoodbyeAds,
        hostsVN: newSettings.HostsVN,
        nextDNSAdsTrackers: newSettings.NextDNSAdsTrackers,
    };

    const fetchOptions: RequestInit = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendPayload), // Send the mapped payload
    };

    try {
        console.log(`Updating privacy settings at: ${url}`);
        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Error updating privacy settings: ${response.status} ${response.statusText}`, errorBody);
            throw new Error(`Failed to update privacy settings: ${response.status}`);
        }

        console.log(`Successfully updated privacy settings for user ${userId}`);
        return true;

    } catch (error) {
        console.error(`Failed to execute PATCH request to ${url}:`, error);
        return false;
    }
}

// Fetch parental control settings from the backend
export async function getParentalControlSettings(): Promise<ParentalControlSettings | null> {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        console.error("User ID not found in session.");
        return null;
    }

    const apiUrl = process.env.NEXT_PUBLIC_SETTINGS_API_URL || "http://localhost:8080";
    const url = `${apiUrl}/settings/parental/${userId}`; // Use the parental control endpoint

    const fetchOptions: RequestInit = {
        method: 'GET',
        // Add cache control if needed, e.g., 'no-store' for dynamic data
        cache: 'no-store',
    };

    try {
        console.log(`Fetching parental control settings from: ${url}`);
        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Error fetching parental control settings: ${response.status} ${response.statusText}`, errorBody);
            throw new Error(`Failed to fetch parental control settings: ${response.status}`);
        }

        const settings: BackendParentalControlSettings = await response.json();

        // Assuming the frontend ParentalControlSettings type matches the backend structure (camelCase)
        // If your frontend type uses different casing, map the fields here.
        console.log("Successfully fetched parental control settings:", settings);
        return settings; // Return the structure directly

    } catch (error) {
        console.error(`Failed to execute fetch request to ${url}:`, error);
        return null;
    }
}

// Update parental control settings
export async function updateParentalControlSettings(newSettings: ParentalControlSettings): Promise<boolean> {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        console.error("User ID not found in session.");
        return false;
    }

    const apiUrl = process.env.NEXT_PUBLIC_SETTINGS_API_URL || "http://localhost:8080";
    const url = `${apiUrl}/settings/parental/${userId}`; // Use the parental control endpoint

    // Prepare the payload. The Go backend expects 'blockedApps' and 'recreationSchedule'.
    // We don't need to send userId in the body as it's in the URL path.
    const backendPayload: Omit<BackendParentalControlSettings, 'userId'> = {
        blockedApps: newSettings.blockedApps,
        recreationSchedule: newSettings.recreationSchedule,
    };

    const fetchOptions: RequestInit = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendPayload), // Send the mapped payload
    };

    try {
        console.log(`Updating parental control settings at: ${url}`);
        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Error updating parental control settings: ${response.status} ${response.statusText}`, errorBody);
            throw new Error(`Failed to update parental control settings: ${response.status}`);
        }

        // Optionally, you could parse the response body if the backend returns the updated settings
        // const updatedSettings = await response.json();
        // console.log("Received updated settings from backend:", updatedSettings);

        console.log(`Successfully updated parental control settings for user ${userId}`);
        return true;

    } catch (error) {
        console.error(`Failed to execute PATCH request to ${url}:`, error);
        return false;
    }
}

