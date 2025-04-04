import NavLinks from '@/app/ui/dashboard/nav-links';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2  mt-8">
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
      <div className="cards">
        <NavLinks />
        </div>
      </div>
    </div>
  );
}