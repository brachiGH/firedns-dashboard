"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import FireDNSLogo from "./ui/firedns-logo";
import Spline from "@splinetool/react-spline";

export default function Page() {
  return (
    <div className="relative min-h-screen bg-[#121417] text-white flex flex-col">
      {/* Spline background */}
      <div className="absolute inset-0 w-full h-screen z-10">
        <Spline scene="https://prod.spline.design/4rellZQ0KKwq7ZYv/scene.splinecode" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 w-full px-6 py-4 backdrop-blur-md bg-black/30 border-b border-white/10 shadow-lg">
  <div className="max-w-7xl mx-auto flex items-center justify-between">
    {/* Left - Links */}
    <div className="flex items-center gap-6 text-sm md:text-base">
      <Link href="#" className="text-white/70 hover:text-orange-500 transition-colors">
        Pricing
      </Link>
      <Link href="#" className="text-white/70 hover:text-orange-500 transition-colors">
        Privacy Policy
      </Link>
      <Link href="#" className="text-white/70 hover:text-orange-500 transition-colors">
        Help
      </Link>
    </div>

    {/* Center - Glowing Logo */}
    <div className="relative">
      <Link href="/" className="group relative flex items-center justify-center">
        <div className="absolute inset-0 blur-md opacity-30 group-hover:opacity-50 transition-all bg-gradient-to-br from-orange-500 to-yellow-400 rounded-full w-32 h-14 animate-pulse" />
        <div className="z-10 w-64">
          <FireDNSLogo />
        </div>
      </Link>
    </div>

    {/* Right - Auth Buttons */}
    <div className="flex items-center gap-4 text-sm md:text-base">
      <Link
        href="/auth/login"
        className="text-white/70 hover:text-white transition-colors px-3 py-1 rounded-md hover:bg-white/10"
      >
        Login
      </Link>
      <Link
        href="/auth/signup"
        className="text-white bg-orange-600 hover:bg-orange-700 transition-colors px-4 py-1.5 rounded-md shadow-md"
      >
        Signup
      </Link>
    </div>
  </div>
</nav>


      {/* Main Content */}
      <main className="relative z-0 pointer-events-none relative z-10 flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl font-bold mb-6">
          The new <span className="text-orange-600">firewall</span> for the modern{" "}
          <span className="text-orange-600">Internet</span>.
        </h1>
        <p className="text-xl max-w-2xl mb-8">
          FireDNS protects you from all kinds of security threats, blocks ads and trackers on websites
          and in apps and provides a safe and supervised Internet for kids — on all devices and on all
          networks.
        </p>

        <Link
          href="/dashboard"
          className="z-20 pointer-events-auto flex items-center gap-5 self-center rounded-lg bg-orange-600 hover:bg-orange-500 px-6 py-3 text-sm font-medium text-white transition-colors md:text-base"
        >
          <span>Try It now</span> <ArrowRightIcon className="w-5 md:w-6" />
        </Link>

        <p className="mt-4 text-gray-400">No signup required. Sign up later to save your settings.</p>
      </main>
    </div>
  );
}
