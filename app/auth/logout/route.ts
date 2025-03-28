import { signOut } from "@/auth";
import { redirect } from "next/navigation";

export async function GET() {
  await signOut();
  redirect('/');
}
