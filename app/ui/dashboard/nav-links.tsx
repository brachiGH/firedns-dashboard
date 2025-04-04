"use client";
import {
  WrenchScrewdriverIcon,
  Cog6ToothIcon,
  LifebuoyIcon,
  AdjustmentsVerticalIcon,
  LockClosedIcon,
  UsersIcon,
  DocumentMinusIcon,
  DocumentPlusIcon,
  ChartPieIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// Dynamic links array
const links = [
  {
    name: "setup",
    navlinks: [
      { name: "Setup My DNS", href: "/dashboard/setup", icon: WrenchScrewdriverIcon },
      {
        name: "Setup Settings",
        href: "/dashboard/setup/settings",
        icon: Cog6ToothIcon,
      },
      {
        name: "How It Works?",
        href: "/dashboard/setup/howitworks",
        icon: LifebuoyIcon,
      },
    ],
  },
  {
    name: "dns-settings",
    navlinks: [
      {
        name: "General Settings",
        href: "/dashboard/dns-settings",
        icon: AdjustmentsVerticalIcon,
      },
      {
        name: "Privacy",
        href: "/dashboard/dns-settings/privacy",
        icon: LockClosedIcon,
      },
      {
        name: "Parental Control",
        href: "/dashboard/dns-settings/parentalcontrol",
        icon: UsersIcon,
      },
      {
        name: "Denylist",
        href: "/dashboard/dns-settings/denylist",
        icon: DocumentMinusIcon,
      },
      {
        name: "Allowlist",
        href: "/dashboard/dns-settings/allowlist",
        icon: DocumentPlusIcon,
      },
    ],
  },
  {
    name: "analytics",
    navlinks: [
      {
        name: "Analytics",
        href: "/dashboard/analytics",
        icon: ChartPieIcon,
      },
      {
        name: "Logs",
        href: "/dashboard/analytics/logs",
        icon: DocumentTextIcon,
      },
    ],
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((toplink) => {
        if (pathname.includes(toplink.name)) {
          return toplink.navlinks.map((link, index) => {
            const LinkIcon = link.icon;
            // Random color class for demo: you can modify this as needed
            const cardClass = index % 4 === 0
            ? "red"
            : index % 4 === 1
            ? "blue"
            : index % 4 === 2
            ? "green"
            : "yellow";
            return (
              <div key={link.name} className={`card ${cardClass}`}>
                <Link
                  href={link.href}
                  className={clsx(
                    "flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-opacity-60 md:flex-none md:justify-start md:p-2 md:px-3 font-sans",
                    pathname === link.href
                      ? "bg-transparent text-white"
                      : "bg-transparent text-white"
                  )}
                >
                  <LinkIcon className="w-6" />
                  <p className="hidden md:block">{link.name}</p>
                </Link>
              </div>
            );
          });
        }
        return null; // Return null for non-matching toplinks
      })}
    </>
  );
}
