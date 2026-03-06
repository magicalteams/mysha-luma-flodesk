import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  validateAdminPassword,
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_VALUE,
  COOKIE_OPTIONS,
} from "@/lib/admin-auth";
import styles from "../admin.module.css";

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
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <img
          src="/header.png"
          alt="Magical Teams & Mysha Admin Dashboard"
          className={styles.loginLogo}
        />
        <p className={styles.loginSubtitle}>
          Enter your password to continue
        </p>

        {error && (
          <div className={styles.loginError}>
            Incorrect password. Please try again.
          </div>
        )}

        <form action={loginAction}>
          <label htmlFor="password" className={styles.loginLabel}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            className={styles.loginInput}
            placeholder="Enter admin password"
          />
          <button type="submit" className={styles.loginBtn}>
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
