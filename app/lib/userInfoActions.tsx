"use server"

import { connectToDatabase } from "@/app/lib/connect-to-database";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/auth";

export async function getIPv4() {
  // Get request headers
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");

  // Determine the user's IP address
  let rawIp: string | null = forwardedFor
    ? forwardedFor.split(",")[0].trim()
    : realIp;
  let userIp: string | null = null;

  // Check if the raw IP exists and if it's an IPv4-mapped IPv6 address
  if (rawIp) {
    if (rawIp.startsWith("::ffff:")) {
      // Extract the IPv4 part
      userIp = rawIp.substring(7); // Remove '::ffff:'
    } else {
      // Assume it might already be IPv4 or a standard IPv6
      // You could add more robust validation here if needed (e.g., using a regex or library)
      // For simplicity, we'll assign it directly if it's not the mapped format.
      // If you strictly ONLY want IPv4, you'd add a check here.
      userIp = rawIp;
      // Example: Add a check to ensure it looks like an IPv4 address
      // const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
      // if (ipv4Regex.test(rawIp)) {
      //   userIp = rawIp;
      // } else {
      //   userIp = null; // Or handle non-IPv4 cases as needed
      // }
    }
  }

  // You can now use userIp, which should be the IPv4 address if found
  console.log("Detected IPv4:", userIp);
  return userIp;
}

export async function getLastLinkedIPv4(): Promise<string | null> {
  const session = await auth();
  const userId = session?.user?.id;

  if (userId == null || userId == undefined) {
    return null;
  }

  const client = await connectToDatabase();

  try {
    // Query to get the most recent IP for the given userId
    const result = await client.query(
      `SELECT ip
        FROM linked_ips
        WHERE user_id = $1
        ORDER BY time DESC
        LIMIT 1`,
      [userId] // Use parameterized query to prevent SQL injection
    );

    // Check if any row was returned
    if (result.rows.length > 0) {
      return result.rows[0].ip; // Return the IP address from the first row
    } else {
      return null; // No linked IP found for this user
    }
  } catch (error) {
    console.error("Database Error: Failed to get last linked IP.", error);
    // Depending on requirements, you might want to throw the error
    // or return null/undefined to indicate failure.
    // throw error; // Option 1: Re-throw the error
    return null; // Option 2: Return null on error
  } finally {
    client.release();
  }
}

/**
 * Adds or updates the linked IP address for the currently authenticated user.
 * If called without an IP, it attempts to use the current request's IP.
 * @param ipAddress Optional: The IP address to link. If null/undefined, uses the current request IP.
 */
export async function linkIpAddress(
  ipAddress?: string | null
): Promise<{ success: boolean; message: string; ip?: string | null }> {
  const session = await auth();
  const userId = session?.user?.id;

  console.log("dddddd", session, session?.user, userId)

  if (!userId) {
    return { success: false, message: "User not authenticated." };
  }

  let ipToLink = ipAddress;

  // If no IP is provided, try to get the current request IP
  if (!ipToLink) {
    ipToLink = await getIPv4();
  }

  console.log(ipToLink)

  if (!ipToLink) {
    return {
      success: false,
      message: "Could not determine IP address to link.",
    };
  }

  // Basic validation (you might want more robust validation)
  if (typeof ipToLink !== "string" || ipToLink.length === 0) {
    return { success: false, message: "Invalid IP address provided." };
  }

  const client = await connectToDatabase();
  try {
    await client.query("BEGIN"); // Start transaction

    // Insert the new IP address link
    await client.query(
      `INSERT INTO linked_ips (user_id, ip) -- Use snake_case here
        VALUES ($1, $2)
        `,
      [userId, ipToLink]
    );

    await client.query("COMMIT"); // Commit transaction

    // Revalidate the path where the linked IP might be displayed
    revalidatePath("/dashboard"); // Revalidate the entire dashboard or a specific page like /dashboard/setup

    return {
      success: true,
      message: `Successfully linked IP: ${ipToLink}`,
      ip: ipToLink,
    };
  } catch (error) {
    await client.query("ROLLBACK"); // Rollback transaction on error
    console.error("Database Error: Failed to link IP address.", error);
    return {
      success: false,
      message: "Database error: Failed to link IP address.",
    };
  } finally {
    client.release();
  }
}
