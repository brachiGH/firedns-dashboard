// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: "pending" | "paid";
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, "amount"> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: "pending" | "paid";
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: "pending" | "paid";
};

// Define the structure for the settings options expected by the frontend
export interface GeneralSettingsOptions {
  ThreatIntelligence: boolean;
  GoogleSafeBrowsing: boolean;
  HomographProtection: boolean;
  TyposquattingProtection: boolean;
  BlockNewDomains: boolean;
  BlockDynamicDNS: boolean;
  BlockCSAM: boolean;
}

export interface PrivacySettingsOptions {
  AdGuardMobileAdsFilter: boolean;
  AdAway: boolean;
  HageziMultiPro: boolean;
  GoodbyeAds: boolean;
  HostsVN: boolean;
  NextDNSAdsTrackers: boolean;
}

export type securitySettings = {
  title: string;
  description: string;
  setting: keyof GeneralSettingsOptions;
};

export type privacySettings = {
  title: string;
  description: string;
  link: string;
  entries: string;
  updated: string;
  setting: keyof PrivacySettingsOptions;
};

// Define the structure for TimeRange matching the Go backend
export interface TimeRange {
  start: string; // e.g., "12:00 PM"
  end: string; // e.g., "6:30 PM"
}

// Day of the week type definition
export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

// Define the structure returned by the Go backend API for Parental Control Settings
// Keys match the Go struct JSON tags (camelCase)
export interface ParentalControlSettings {
  blockedApps: { [key: string]: boolean }; // Map of app/service name to blocked status
  recreationSchedule: { [key: string]: TimeRange }; // Map of day ("Monday", etc.) to TimeRange
}

export type parentalWebsiteSettings = {
  name: string;
  icon: string;
};

export interface BackendLogEntry {
  domain: string;
  timestamp: string; // Assuming backend sends ISO string (e.g., "2025-04-26T22:20:24.123Z")
  status: 'allowed' | 'blocked';
}