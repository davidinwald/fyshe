import { redirect } from "next/navigation";
import { auth } from "@fyshe/auth";
import { ProfileForm } from "@/components/profile/profile-form";
import { createCaller } from "@/trpc/server";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const trpc = await createCaller();
  const user = await trpc.user.me();

  if (!user) redirect("/login");

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account details.</p>
      </div>
      <ProfileForm user={user} />
    </div>
  );
}
