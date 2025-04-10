import SideNav from "@/app/ui/dashboard/sidenav";
import Topbar from "@/app/ui/dashboard/topbar";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (

<div className="flex h-screen flex-col bg-transparent bg-pattern">
      {/* Top bar */}
      <div className="w-full">
        <Topbar />
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
