"use client";

import Card from "./dashboard-card";
import ClipboardButton from "../clipboard-button";

interface FireDNSSetupGuideProps {
  dnsServers: string[];
}

export default function FireDNSSetupGuide({
  dnsServers,
}: FireDNSSetupGuideProps) {
  const SetupStep = ({
    number,
    children,
  }: {
    number: number;
    children: React.ReactNode;
  }) => (
    <div className="flex items-center space-x-3 mb-2">
      <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold">
        {number}
      </span>
      <span className="text-gray-100">{children}</span>
    </div>
  );

  return (
    <Card
      title="Setup Guide"
      subtitle="Follow the instructions below to set up FireDNS on your device, browser or router."
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-100">
          IPv4 (with Linked IP)
        </h3>

        <div className="space-y-4">
          <SetupStep number={1}>
            Click on the Start menu, then click on Control Panel.
          </SetupStep>

          <SetupStep number={2}>
            Click on Network and Internet, then Network and Sharing Center.
          </SetupStep>

          <SetupStep number={3}>Click on Change Adapter Settings.</SetupStep>

          <SetupStep number={4}>
            Right click on the Wi-Fi network you are connected to, then click
            Properties.
          </SetupStep>

          <SetupStep number={5}>Select Internet Protocol Version 4.</SetupStep>

          <SetupStep number={6}>Click Properties.</SetupStep>

          <SetupStep number={7}>
            Click Use The Following DNS Server Addresses.
          </SetupStep>

          <SetupStep number={8}>
            <div className="flex items-center space-x-2">
              <span>Replace the current addresses (if any) with</span>
              {dnsServers.map((server) => (
                <div
                  key={server}
                  className="flex items-center bg-gray-100 px-2 py-1 rounded bg-orange-400"
                >
                  <span>{server}</span>
                  <ClipboardButton text={server} />
                </div>
              ))}
            </div>
          </SetupStep>

          <SetupStep number={9}>
            Click OK, then Close. You may need to restart your browser.
          </SetupStep>
        </div>

        <div className="mt-6 bg-orange-50 border-l-4 border-orange-500 p-4">
          <p className="text-orange-800">
            <strong>Tip:</strong> After setting up, verify your DNS settings to
            ensure they are correctly configured.
          </p>
        </div>
      </div>
    </Card>
  );
}
