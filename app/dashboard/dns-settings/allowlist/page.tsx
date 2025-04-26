import { getAllowList } from "@/app/lib/userSettingActions";
import Allowlist from "@/app/ui/dns-settings/allowlist"

export default async function Page() {
  let AllowList = await getAllowList()
  if (AllowList == null) {
    AllowList = []
  }
  return (
    <main>
      <Allowlist AllowList={AllowList}/>
    </main>
  );
}
