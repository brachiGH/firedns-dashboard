"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import LinkedIp from "@/app/ui/dashboard/topbarComponents/linkedIpCard";

const links = [
  { name: "Setup", href: "/dashboard/setup" },
  { name: "DNS Settings", href: "/dashboard/dns-settings" },
  { name: "Analytics", href: "/dashboard/analytics" },
];

interface TopbarProps {
  userEmail: string | null | undefined;
  userIp: string | null | undefined;
  lastLinkedIp: string | null | undefined;
}

export default function Topbar({ userEmail, userIp, lastLinkedIp }: TopbarProps) {
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
            <span className="font-sans">{userEmail}</span>
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
      {/* Left - User Info */}
      <LinkedIp currentIp={userIp} isLinked={userIp == lastLinkedIp} />
    </div>
  );
}
