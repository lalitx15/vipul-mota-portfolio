"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/ui/sign-in-card-2";

function SignupForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/member";

  return <AuthCard mode="signup" next={next} />;
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full py-16 text-center text-stone editorial-label text-xs">
          Loading Membership Enrolment...
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
