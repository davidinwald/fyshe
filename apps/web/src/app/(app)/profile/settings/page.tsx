import { redirect } from "next/navigation";
import { auth } from "@fyshe/auth";
import { PreferencesForm } from "@/components/profile/preferences-form";
import { createCaller } from "@/trpc/server";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const trpc = await createCaller();
  const user = await trpc.user.me();

  if (!user) redirect("/login");

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your fishing preferences.</p>
      </div>
      <PreferencesForm preferences={user.preferences} />
    </div>
  );
}
