import Link from "next/link";

export default function FireDNSLogo() {
  return (
    <Link href="/dashboard" className={`flex flex-row items-center leading-none text-white space-x-4 mouse-pointer`}>
      <img src="/logo.png" alt="FireDNS Logo" className="h-8 w-8" />
      <span className="text-xl font-bold">
        Fire<span className="text-orange-600">DNS</span>
      </span>
    </Link>
  );
}
