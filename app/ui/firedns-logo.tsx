import Link from "next/link";
import Image from "next/image";

export default function FireDNSLogo() {
  return (
    <Link href="/dashboard" className={`flex flex-row items-center leading-none text-white space-x-4 mouse-pointer`}>
      <Image width={32} height={32} src="/logo.png" alt="FireDNS Logo" />
      <span className="text-xl font-bold">
      Fire<span className="text-orange-600">DNS</span>
      </span>
    </Link>
  );
}
