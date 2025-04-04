"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ArrowPathIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import FireDNSLogo from "@/app/ui/firedns-logo";

const links = [
  { name: "Setup", href: "/dashboard/setup" },
  { name: "DNS Settings", href: "/dashboard/dns-settings" },
  { name: "Analytics", href: "/dashboard/analytics" },
];

export default function Topbar() {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="relative flex items-center justify-between px-6 py-4 bg-[#0f0f0f] shadow-md border-b border-[#1e1e1e]">

{/* Right - Nav + Dropdown */}
<div className="flex items-center space-x-4 text-sm">
        <nav className="hidden md:flex space-x-3 font-medium">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "px-3 py-1 rounded hover:bg-orange-700/20 transition",
                pathname.includes(link.href)
                  ? "text-orange-400 border-b-2 border-orange-500"
                  : "text-gray-200"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 text-white hover:text-orange-300 transition"
          >
            <span className="font-sans">myemail@mail.com</span>
            <ChevronDownIcon className="h-4 w-4" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md shadow-lg z-50">
              <Link
                href="/account"
                className="block px-4 py-2 text-white hover:bg-blackbg-300"
              >
                Account
              </Link>
              <Link
                href="/help"
                className="block px-4 py-2 text-white hover:bg-blackbg-300"
              >
                Help
              </Link>
              <Link
                href="/auth/logout"
                className="block px-4 py-2 text-orange-400 hover:bg-blackbg-300"
              >
                Log out
              </Link>
            </div>
          )}
        </div>
      </div>
      {/* Center - Glowing Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2 z-10 flex items-center justify-center">
        <Link href="/" className="group relative flex items-center justify-center">
          <div className="absolute inset-0 blur-md opacity-30 group-hover:opacity-50 transition-all bg-gradient-to-br from-orange-500 to-yellow-400 rounded-full w-32 h-14 animate-pulse" />
          <div className="z-10 w-64">
            <FireDNSLogo />
          </div>
        </Link>
      </div>
      {/* Left - User Info */}
      <div className="flex items-center space-x-3 text-sm text-gray-300">
        <span className="px-3 py-1 bg-blackbg-300 rounded-md text-green-400">
          IP: 192.168.1.1
        </span>
        <button className="flex items-center gap-1 text-red-400 hover:text-red-300 transition">
          Link My IP
          <ArrowPathIcon className="h-4 w-4" />
        </button>
      </div>
      
    </div>
  );
}
