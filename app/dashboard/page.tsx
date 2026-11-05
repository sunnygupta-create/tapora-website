"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.replace("/login");
        return;
      }

      setEmail(data.user.email || "");
      setLoading(false);
    }

    checkUser();
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <main style={{
      maxWidth: "700px",
      margin: "60px auto",
      padding: "24px",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1>Welcome to TAPORA.</h1>
      <p>Your business dashboard</p>

      <p>Logged in as: {email}</p>

      <hr />

      <h2>My Digital Profile</h2>
      <p>Your NFC profile management will appear here.</p>

      <button onClick={logout}>
        Log out
      </button>
    </main>
  );
}
