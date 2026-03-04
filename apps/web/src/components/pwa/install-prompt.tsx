"use client";

import { useState, useEffect } from "react";
import { Button } from "@fyshe/ui";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    function handleBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () =>
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm rounded-lg border bg-card p-4 shadow-lg sm:left-auto sm:right-4">
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium">Install Fyshe</p>
          <p className="text-xs text-muted-foreground">
            Add to your home screen for the best experience.
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => setDismissed(true)}>
            Later
          </Button>
          <Button size="sm" onClick={handleInstall}>
            Install
          </Button>
        </div>
      </div>
    </div>
  );
}
