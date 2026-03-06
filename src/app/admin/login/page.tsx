import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  validateAdminPassword,
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_VALUE,
  COOKIE_OPTIONS,
} from "@/lib/admin-auth";

async function loginAction(formData: FormData) {
  "use server";

  const password = formData.get("password") as string;

  if (!validateAdminPassword(password)) {
    redirect("/admin/login?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE, COOKIE_OPTIONS);
  redirect("/admin");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 20, marginBottom: 24 }}>Mysha Admin</h1>

      {error && (
        <p style={{ color: "#dc2626", marginBottom: 16 }}>
          Incorrect password. Try again.
        </p>
      )}

      <form action={loginAction}>
        <label
          htmlFor="password"
          style={{ display: "block", marginBottom: 8, fontSize: 14 }}
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          style={{
            width: "100%",
            padding: "8px 12px",
            fontSize: 14,
            border: "1px solid #d1d5db",
            borderRadius: 6,
            marginBottom: 16,
            boxSizing: "border-box",
          }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "8px 16px",
            fontSize: 14,
            backgroundColor: "#111",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Log in
        </button>
      </form>
    </div>
  );
}
