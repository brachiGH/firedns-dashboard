"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import FireDNSLogo from "@/app/ui/firedns-logo";
import {
  ChevronDownIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { name: "Setup", href: "/dashboard/setup" },
  { name: "DNS Settings", href: "/dashboard/settings" },
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
    <div className="bg-blackbg-100 flex items-end justify-between border-b border-blackbg-300">
      <Link
        className="flex items-end justify-start p-4 md:ml-2 md:w-64"
        href="/"
      >
        <FireDNSLogo />
      </Link>

      {/* Navigation Links */}
      <div className="flex-grow flex items-end space-x-1 md:pl-1 text-sm md:text-lg">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              `px-3 py-2 text-gray-100 font-sans
          hover:bg-blackbg-300
          hover:border-b-2 
          hover:border-orange-200 
          transition-all 
          duration-200 
          ease-in-out`,
              pathname.includes(link.href)
                ? "border-b-2 border-orange-400 text-orange-400"
                : ""
            )}
          >
            {link.name}
          </Link>
        ))}
      </div>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center justify-center p-2 rounded text-green-300 hover:bg-blackbg-300"
      >
        <span className="mr-2">Current IP: 192.168.1.1</span>
      </button>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center justify-center p-2 mr-4 rounded text-red-400 hover:bg-blackbg-300"
      >
        <span className="mr-2">Link My IP</span>
        <ArrowPathIcon className="h-4 w-4" />
      </button>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-center p-2 mr-4 rounded text-white hover:bg-blackbg-300"
        >
          <span className="mr-2 font-sans">myemail@mail.com</span>
          <ChevronDownIcon className="h-4 w-4" />
        </button>
        {isDropdownOpen && (
          <div className="absolute right-4 top-full mt-1 w-48 bg-blackbg-200 border border-blackbg-300 rounded shadow-lg z-50">
            <div className="py-1">
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
          </div>
        )}
      </div>
    </div>
  );
}
