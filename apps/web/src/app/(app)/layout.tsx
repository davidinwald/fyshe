import { redirect } from "next/navigation";
import { auth } from "@fyshe/auth";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { InstallPrompt } from "@/components/pwa/install-prompt";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex">
      <AppSidebar user={session.user} />
      <div className="flex-1 flex flex-col">
        <AppHeader user={session.user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
      <InstallPrompt />
    </div>
  );
}
