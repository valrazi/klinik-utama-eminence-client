"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BackofficePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Wait for session to load

    if (!session) {
      // Not logged in → redirect to login or wherever
      router.push("/login");
    } else if (session.user.level !== "superadmin") {
      // Logged in but not superadmin → redirect to /backoffice/data-guru
      router.push("/backoffice/berita-laporan");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Welcome Superadmin</h1>
    </div>
  );
}
