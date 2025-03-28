import Endpoints from "@/app/ui/setup/end-points";
import LinkedIP from "@/app/ui/setup/setup-linked-ip";
import SetupGuide from "@/app/ui/setup/setup-guide";

export default async function Page() {
  return (
    <main className="w-full">
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 m-1 mt-0">
          <Endpoints
            firednsid={"e35186"}
            dnsOverTlsQuic={"e35186.dns.brachi.me"}
            dnsOverHttps={"https://dns.brachi.me/e35186"}
            ipv6={["IPv6 Not yet supported", "IPv6 Not yet supported"]}
          />
        </div>
        <div className="flex-1 m-1 mt-2 lg:mt-0">
          <LinkedIP
            currentDnsResolver="Unknown"
            dnsServers={["45.90.28.128", "45.90.30.128"]}
            linkedIp="197.25.218.162"
          />
        </div>
      </div>
      <div className="flex-1 m-1">
        <SetupGuide dnsServers={["45.90.28.128", "45.90.30.128"]} />
      </div>
    </main>
  );
}
