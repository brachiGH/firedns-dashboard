import SideNav from "@/app/ui/dashboard/sidenav";
import Topbar from "@/app/ui/dashboard/topbar";
import { auth } from '@/auth';
import { getIPv4, getLastLinkedIPv4 } from "@/app/lib/userInfoActions";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const userEmail = session?.user?.email;

  const currentUserIPv4 = await getIPv4();
  const lastLinkedIPv4 = await getLastLinkedIPv4();

  return (
    <div className="flex min-h-screen flex-col bg-transparent bg-pattern">
      {/* Top bar */}
      <div className="w-full">
        <Topbar userEmail={userEmail} userIp={currentUserIPv4} lastLinkedIp={lastLinkedIPv4} />
      </div>
      
      {/* Main content area with sidebar and children */}
      <div className="flex flex-grow flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
      </div>
    </div>
  );
}
