import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, fullName, avatarUrl, requireAdmin } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const admin = createAdminClient();

    // 1. Generate an authentication link/token for the verified Google user
    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: normalizedEmail,
      options: {
        data: {
          full_name: fullName || "",
          avatar_url: avatarUrl || "",
        },
      },
    });

    if (linkError || !linkData?.properties?.hashed_token) {
      return NextResponse.json(
        { error: linkError?.message || "Failed to generate authentication link." },
        { status: 500 }
      );
    }

    // 2. Verify OTP through SSR client to automatically set Supabase session cookies
    const supabase = createServerClient();
    const verificationType = (linkData.properties.verification_type || "magiclink") as
      | "signup"
      | "magiclink"
      | "email";

    const { data: sessionData, error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: linkData.properties.hashed_token,
      type: verificationType,
    });

    if (verifyError || !sessionData?.user) {
      return NextResponse.json(
        { error: verifyError?.message || "Failed to establish secure session." },
        { status: 401 }
      );
    }

    const userId = sessionData.user.id;

    // 3. Upsert profile with latest Google name & avatar
    await (admin.from("profiles") as any)
      .upsert(
        {
          id: userId,
          email: normalizedEmail,
          full_name: fullName || sessionData.user.user_metadata?.full_name || "",
          avatar_url: avatarUrl || sessionData.user.user_metadata?.avatar_url || "",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

    // 4. Enforce administrative role if required
    if (requireAdmin) {
      const { data: profile } = await (admin.from("profiles") as any)
        .select("role, status")
        .eq("id", userId)
        .single();

      if (!profile || profile.role !== "admin" || profile.status !== "active") {
        await supabase.auth.signOut();
        return NextResponse.json(
          { error: "Access denied. Administrative privileges are required." },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({ success: true, userId });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error during authentication sync." },
      { status: 500 }
    );
  }
}
