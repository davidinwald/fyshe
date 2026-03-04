"use client";

import { signIn } from "next-auth/react";
import { Button } from "@fyshe/ui";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Welcome to Fyshe</h1>
        <p className="text-muted-foreground">Sign in to start tracking your fishing.</p>
      </div>

      <div className="space-y-3">
        <Button
          className="w-full"
          variant="outline"
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
        >
          Continue with GitHub
        </Button>
        <Button
          className="w-full"
          variant="outline"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          Continue with Google
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        By signing in, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
