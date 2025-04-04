"use client";
import React from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import ClipboardButton from "../clipboard-button";
import Card from "./dashboard-card";

interface SettingsProps {
  currentDnsResolver: string;
  dnsServers: string[];
  linkedIp: string;
}

export default function FireDNSLinkedIP({
  currentDnsResolver,
  dnsServers,
  linkedIp,
}: SettingsProps) {
  return (
    <Card title="Setup FireDNS" subtitle="Set up FireDNS using linked IP.">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between py-2 border-b border-gray-200">
          <span className="text-gray-100">Current DNS Resolver:</span>
          <span className="bg-gray-100 px-2 py-1 rounded text-sm h-9 flex items-center justify-center">
            {currentDnsResolver}
          </span>
        </div>

        <div>
          <h3 className="text-gl font-medium mb-2 text-gray-100">
            DNS Servers IPv4
          </h3>
          <div className="space-y-2">
            {dnsServers.map((server) => (
              <div
                key={server}
                className="flex items-center justify-between bg-orange-600 p-2 rounded text-gray-100"
              >
                <span>{server}</span>
                <ClipboardButton text={server} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
          <span className="text-gray-100">Linked IP:</span>
          <div className="flex items-center space-x-2">
            <span className="bg-red-300 px-2 py-1 rounded text-sm">
              {linkedIp}
              <ArrowPathIcon className="h-4 w-4 inline ml-2 cursor-pointer" />
            </span>
            <span className="bg-green-300 px-2 py-1 rounded text-sm">
              {linkedIp}
            </span>
          </div>
        </div>

        <p className="text-xl text-gray-100 bold">What is Linked IP?</p>
        <div className="text-sm text-gray-300">
          <pre className="whitespace-pre-wrap">
            FireDNS associates configurations with networks or devices using
            different methods based on the DNS protocol. For UDP over IPv6, the
            configuration ID is embedded in the last bits of the IP. However,
            for legacy UDP over IPv4, no such trick exists due to IPv4 scarcity.
            Instead, users must manually link their network IP to their
            configuration, with a pool of IPv4 addresses allowing multiple
            configurations if needed.{" "}
          </pre>
          <pre className="whitespace-pre-wrap">
            To link an IP, users can click the link button in the setup tab, but
            this must be repeated if the IP is dynamic.{" "}
          </pre>
        </div>
      </div>
    </Card>
  );
}
