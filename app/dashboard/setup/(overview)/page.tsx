import Endpoints from "@/app/ui/setup/end-points";
import LinkedIP from "@/app/ui/setup/setup-linked-ip";
import SetupGuide from "@/app/ui/setup/setup-guide";
import { auth } from '@/auth';
import { getIPv4, getLastLinkedIPv4 } from "@/app/lib/userInfoActions";


export default async function Page() {
  const session = await auth();
  const dnsServerAddress1 = "197.14.146.92"
  const dnsServerAddress2 = "197.14.146.93"

  const currentUserIPv4 = await getIPv4();
  const lastLinkedIPv4 = await getLastLinkedIPv4();
  const userId = session?.user?.id;
  

  return (
    <main className="w-full">
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 m-1 mt-0">
          <Endpoints
            firednsid={userId!}
            dnsOverHttps={"https://dns.brachi.me/"+userId!}
            ipv6={["IPv6 Not yet supported", "IPv6 Not yet supported"]}
          />
        </div>
        <div className="flex-1 m-1 mt-2 lg:mt-0">
          <LinkedIP
            currentDnsResolver="Unknown"
            dnsServers={[dnsServerAddress1, dnsServerAddress2]}
            linkedIp={lastLinkedIPv4}
            isLinked={lastLinkedIPv4 == currentUserIPv4}
          />
        </div>
      </div>
      <div className="flex-1 m-1">
        <SetupGuide dnsServers={[dnsServerAddress1, dnsServerAddress2]} />
      </div>
    </main>
  );
}
