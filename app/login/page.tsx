"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.session) {
          router.push("/dashboard");
        } else {
          setMessage("Account created! Check your email to verify it, then log in.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        router.push("/dashboard");
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#f7f6f2",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "Arial, sans-serif"
    }}>
      <section style={{
        background: "white",
        width: "100%",
        maxWidth: "420px",
        padding: "36px 28px",
        borderRadius: "18px",
        textAlign: "center"
      }}>
        <Link href="/" style={{
          fontSize: "30px",
          fontWeight: "bold",
          letterSpacing: "5px",
          color: "#171717",
          textDecoration: "none"
        }}>
          TAPORA.
        </Link>

        <h1 style={{ marginTop: "35px" }}>
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>

        <p style={{ color: "#777" }}>
          Manage your digital business profile.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Business email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={fieldStyle}
          />

          <input
            type="password"
            placeholder="Password (minimum 6 characters)"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={fieldStyle}
          />

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Please wait..." : isSignup ? "Create account" : "Log in"}
          </button>
        </form>

        {message && (
          <p style={{ color: "#9b7040", marginTop: "18px" }}>
            {message}
          </p>
        )}

        <p style={{ marginTop: "25px", color: "#666" }}>
          {isSignup ? "Already registered?" : "New to TAPORA?"}
          {" "}
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setMessage("");
            }}
            style={{
              border: "none",
              background: "none",
              color: "#171717",
              fontWeight: "bold"
            }}
          >
            {isSignup ? "Log in" : "Create account"}
          </button>
        </p>

        <Link href="/" style={{ color: "#777", fontSize: "14px" }}>
          Back to homepage
        </Link>
      </section>
    </main>
  );
}

const fieldStyle = {
  width: "100%",
  padding: "15px",
  marginTop: "16px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  fontSize: "16px",
  boxSizing: "border-box" as const
};

const buttonStyle = {
  width: "100%",
  padding: "16px",
  marginTop: "22px",
  background: "#171717",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer"
};
