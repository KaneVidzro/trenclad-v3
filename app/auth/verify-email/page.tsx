import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function VerifyEmailPage() {
  const user = await getUser();
  if (user) {
    redirect("/account");
  }
  return <VerifyEmailForm />;
}
