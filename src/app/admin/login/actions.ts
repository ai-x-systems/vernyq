"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, checkAdminPassword, createSessionToken } from "@/lib/admin-session";

export type LoginResult = { error: string } | undefined;

export async function loginAction(_prevState: LoginResult, formData: FormData): Promise<LoginResult> {
  const password = formData.get("password");

  if (typeof password !== "string" || password.length === 0) {
    return { error: "Enter the admin password." };
  }

  let valid: boolean;
  try {
    valid = checkAdminPassword(password);
  } catch {
    return { error: "Admin login isn't configured yet (missing environment variables)." };
  }

  if (!valid) {
    return { error: "Incorrect password." };
  }

  const token = createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days, matches token TTL
  });

  redirect("/admin/orders");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}
