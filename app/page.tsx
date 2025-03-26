import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import FireDNSLogo from "./ui/firedns-logo";

export default function Page() {
  return (
<div className="min-h-screen bg-[#121417] text-white flex flex-col">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <FireDNSLogo />
        <div className="flex space-x-6">
          <a href="#" className="hover:text-[#f2874e]">Pricing</a>
          <a href="#" className="hover:text-[#f2874e]">Privacy Policy</a>
          <a href="#" className="hover:text-[#f2874e]">Help</a>
        </div>
        <div className="space-x-4">
          <Link href="/login" className="text-white/70 hover:text-white transition-colors px-3 py-1 rounded-md hover:bg-white/10">
            login
          </Link>
          <Link href="/signup" className="text-white bg-orange-600 hover:bg-orange-700 transition-colors px-4 py-2 rounded-md">
            signup
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl font-bold mb-6">
          The new <span className="text-orange-600">firewall</span> for the modern <span className="text-orange-600">Internet</span>.
        </h1>
        <p className={`text-xl max-w-2xl mb-8`}>
          FireDNS protects you from all kinds of security threats, blocks ads and trackers on websites
          and in apps and provides a safe and supervised Internet for kids — on all devices and on all
          networks.
        </p>
        
        <Link
          href="/dashboard"
          className="flex items-center gap-5 self-center rounded-lg bg-orange-600 hover:bg-orange-500 px-6 py-3 text-sm font-medium text-white transition-colors md:text-base"
        >
          <span>Try It now</span> <ArrowRightIcon className="w-5 md:w-6" />
        </Link>
        
        <p className="mt-4 text-gray-400">No signup required. Sign up later to save your settings.</p>
      </main>
    </div>
  );
}
