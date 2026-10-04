"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/ui/sign-in-card-2";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/member";
  const callbackError = searchParams.get("error");

  const initialError =
    callbackError === "auth_callback_failed"
      ? "Authentication session could not be established. Please try again."
      : null;

  return <AuthCard mode="login" next={next} initialError={initialError} />;
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full py-16 text-center text-stone editorial-label text-xs">
          Loading Authentication Terminal...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
