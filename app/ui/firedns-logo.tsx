import Image from "next/image";

export default function FireDNSLogo() {
  return (
    <div className={`flex flex-row items-center leading-none text-white space-x-4`}>
      <Image width={32} height={32} src="/logo.png" alt="FireDNS Logo" />
      <span className="text-xl font-bold cursor-inherit select-none">
        Fire<span className="text-orange-600">DNS</span>
      </span>
    </div>
  );
}
