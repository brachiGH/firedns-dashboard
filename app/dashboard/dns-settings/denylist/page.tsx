"use server"
import { getDenyList } from "@/app/lib/userSettingActions";
import Denylist from "@/app/ui/dns-settings/denylist"

export default async function Page() {
  let DenyList = await getDenyList()
  if (DenyList == null) {
    DenyList = []
  }

  return (
    <main>
      <Denylist DenyList={DenyList} />
    </main>
  );
}
