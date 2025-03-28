"use client";

import React from "react";
import ClipboardButton from "../clipboard-button";
import Card from "./dashboard-card";

interface EndpointsProps {
  firednsid: string;
  dnsOverTlsQuic: string;
  dnsOverHttps: string;
  ipv6: string[];
}

export default function Endpoints({
  firednsid,
  dnsOverTlsQuic,
  dnsOverHttps,
  ipv6,
}: EndpointsProps) {
  const EndpointRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
      <span className="text-gray-100 font-medium">{label}</span>
      <div className="flex items-center space-x-2">
        <span className="text-white bg-orange-400 px-2 py-1 rounded text-sm flex items-center">
          {value}
          <ClipboardButton text={value} />
        </span>
      </div>
    </div>
  );

  return (
    <Card
      title="Endpoints"
      subtitle="Set up FireDNS with this profile using one of the endpoints below."
    >
      <div className="p-6">
        <EndpointRow label="ID" value={firednsid} />
        <EndpointRow label="DNS-over-TLS/QUIC" value={dnsOverTlsQuic} />
        <EndpointRow label="DNS-over-HTTPS" value={dnsOverHttps} />
        <h3 className="text-gl font-medium mb-2 mt-3 text-gray-100">
          DNS Servers IPv6
        </h3>
        <div className="space-y-2">
          {ipv6.map((server, index) => (
            <div
              key={server+index}
              className="flex items-center justify-between bg-orange-400 p-2 rounded text-gray-100"
            >
              <span>{server}</span>
              <ClipboardButton text={server} />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
