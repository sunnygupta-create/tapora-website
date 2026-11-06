
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Profile = {
  slug: string;
  business_name: string;
  category: string | null;
  description: string | null;
  whatsapp: string | null;
  instagram_url: string | null;
  google_review_url: string | null;
  website_url: string | null;
  location: string | null;
  logo_url: string | null;
  is_published: boolean;
};

export default function ProfilePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!slug) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (error) {
        setError("Unable to load this profile. Please try again.");
      } else if (!data) {
        setProfile(null);
      } else {
        setProfile(data as Profile);
      }

      setLoading(false);
    }

    loadProfile();
  }, [slug]);

  if (loading) {
    return <main style={styles.page}>Loading profile...</main>;
  }

  if (error) {
    return <main style={styles.page}>{error}</main>;
  }

  if (!profile) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <h1>Profile not found</h1>
          <p>This digital business profile does not exist or is not published.</p>
          <a href="/" style={styles.button}>Visit TAPORA</a>
        </div>
      </main>
    );
  }

  const phone = (profile.whatsapp || "").replace(/\D/g, "");
  const whatsappNumber =
    phone.length === 10 ? "91" + phone : phone;

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        `Hi ${profile.business_name}, I want to know more about your products.`
      )}`
    : "";

  const profileUrl =
    `https://tapora-website-phi.vercel.app/p/${profile.slug}`;

  const qrUrl =
    `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(profileUrl)}`;

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          {profile.logo_url ? (
            <img
              src={profile.logo_url}
              alt={profile.business_name}
              style={styles.logoImage}
            />
          ) : (
            "T."
          )}
        </div>

        <p style={styles.brand}>POWERED BY TAPORA</p>

        <h1 style={styles.name}>{profile.business_name}</h1>

        {profile.category && (
          <p style={styles.category}>{profile.category}</p>
        )}

        {profile.description && (
          <p style={styles.description}>{profile.description}</p>
        )}

        {whatsappUrl && (
          <a href={whatsappUrl} target="_blank" rel="noreferrer" style={styles.button}>
            WhatsApp
          </a>
        )}

        {profile.instagram_url && (
          <a href={profile.instagram_url} target="_blank" rel="noreferrer" style={styles.secondary}>
            Instagram
          </a>
        )}

        {profile.google_review_url && (
          <a href={profile.google_review_url} target="_blank" rel="noreferrer" style={styles.secondary}>
            Write a Google Review
          </a>
        )}

        {profile.website_url && (
          <a href={profile.website_url} target="_blank" rel="noreferrer" style={styles.secondary}>
            Visit Website
          </a>
        )}

        {profile.location && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.location)}`}
            target="_blank"
            rel="noreferrer"
            style={styles.secondary}
          >
            View Location
          </a>
        )}

        <div style={styles.qrBox}>
          <p>SCAN TO OPEN PROFILE</p>
          <img src={qrUrl} alt="Business profile QR code" width="180" height="180" />
          <small style={{
  display: "block",
  textAlign: "center",
  overflowWrap: "anywhere",
  wordBreak: "break-word",
  lineHeight: 1.5,
  marginTop: "12px"
}}>
  {profileUrl}
</small>
        </div>

        <p style={styles.footer}>Powered by TAPORA · Smart Connections.</p>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f4f2ed",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "25px 15px",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "#fff",
    width: "100%",
    maxWidth: "420px",
    borderRadius: "18px",
    padding: "35px 25px",
    textAlign: "center",
    boxShadow: "0 10px 40px #00000012",
  },
  logo: {
    width: "65px",
    height: "65px",
    margin: "0 auto 15px",
    background: "#171717",
    color: "#fff",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    fontSize: "30px",
    fontWeight: "bold",
    overflow: "hidden",
  },
  logoImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  brand: {
    color: "#a18451",
    letterSpacing: "3px",
    fontSize: "11px",
    fontWeight: "bold",
  },
  name: {
    fontSize: "30px",
    marginBottom: "8px",
  },
  category: {
    color: "#a18451",
    fontWeight: "bold",
  },
  description: {
    color: "#666",
    lineHeight: 1.7,
    margin: "25px 0",
  },
  button: {
    display: "block",
    background: "#171717",
    color: "#fff",
    padding: "15px",
    borderRadius: "8px",
    textDecoration: "none",
    marginBottom: "12px",
  },
  secondary: {
    display: "block",
    border: "1px solid #ddd",
    color: "#171717",
    padding: "14px",
    borderRadius: "8px",
    textDecoration: "none",
    marginBottom: "12px",
  },
  qrBox: {
  marginTop: "30px",
  padding: "24px",
  background: "#f4f5f0",
  borderRadius: "12px",
  textAlign: "center",
  overflow: "hidden",
},
