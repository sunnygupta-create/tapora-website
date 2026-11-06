
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
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

const emptyForm = {
  id: "",
  slug: "",
  business_name: "",
  category: "",
  description: "",
  whatsapp: "",
  instagram_url: "",
  google_review_url: "",
  website_url: "",
  location: "",
  logo_url: "",
  is_published: false,
};

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function initialize() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.replace("/login");
        return;
      }

      setUser(data.user);

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .maybeSingle();

      const admin = roleData?.role === "admin";
      setIsAdmin(admin);

      if (admin) {
        await loadProfiles();
      } else {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .maybeSingle();

        if (profile) {
          setForm({ ...emptyForm, ...profile });
          setEditingId(profile.id);
        }
      }

      setLoading(false);
    }

    initialize();
  }, [router]);

  async function loadProfiles() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      return;
    }

    setProfiles(data || []);
  }

  function updateField(name: string, value: string | boolean) {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function editProfile(profile: Profile) {
  setForm({
    ...emptyForm,
    id: profile.id,
    slug: profile.slug,
    business_name: profile.business_name,
    category: profile.category ?? "",
    description: profile.description ?? "",
    whatsapp: profile.whatsapp ?? "",
    instagram_url: profile.instagram_url ?? "",
    google_review_url: profile.google_review_url ?? "",
    website_url: profile.website_url ?? "",
    location: profile.location ?? "",
    logo_url: profile.logo_url ?? "",
    is_published: profile.is_published,
  });

  setEditingId(profile.id);
  setMessage("");
  window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function newProfile() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
  }

  async function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const slug =
      form.slug.trim() ||
      form.business_name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    if (!slug || !form.business_name.trim()) {
      setMessage("Business name and profile URL are required.");
      setSaving(false);
      return;
    }

    const profileId = isAdmin
      ? (editingId || form.id.trim())
      : user.id;

    if (!profileId) {
      setMessage("Enter the customer's registered Supabase User ID.");
      setSaving(false);
      return;
    }

    const payload = {
      id: profileId,
      slug,
      business_name: form.business_name.trim(),
      category: form.category || null,
      description: form.description || null,
      whatsapp: form.whatsapp || null,
      instagram_url: form.instagram_url || null,
      google_review_url: form.google_review_url || null,
      website_url: form.website_url || null,
      location: form.location || null,
      logo_url: form.logo_url || null,
      is_published: form.is_published,
    };

    const result = editingId
      ? await supabase
          .from("profiles")
          .update(payload)
          .eq("id", editingId)
      : await supabase
          .from("profiles")
          .insert(payload);

    if (result.error) {
      setMessage("Error: " + result.error.message);
      setSaving(false);
      return;
    }

    setMessage("Profile saved successfully!");
    setSaving(false);

    if (isAdmin) {
      await loadProfiles();
      newProfile();
    } else {
      setEditingId(profileId);
      setForm({ ...form, id: profileId, slug });
    }
  }

  async function deleteProfile(id: string) {
    if (!window.confirm("Delete this customer profile?")) return;

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Profile deleted.");
    await loadProfiles();
    newProfile();
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  const visibleProfiles = profiles.filter((profile) =>
    profile.business_name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    marginTop: "6px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "15px",
    boxSizing: "border-box",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "12px 18px",
    background: "#171717",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  };

  if (loading) {
    return <main style={{ padding: 30 }}>Loading TAPORA dashboard...</main>;
  }

  return (
    <main
      style={{
        maxWidth: "1000px",
        margin: "30px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        color: "#171717",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 15,
        }}
      >
        <div>
          <h1 style={{ marginBottom: 5 }}>TAPORA.</h1>
          <p style={{ color: "#777", marginTop: 0 }}>
            {isAdmin ? "Admin Dashboard" : "My Business Dashboard"}
          </p>
        </div>

        <button style={buttonStyle} onClick={logout}>
          Log out
        </button>
      </header>

      <p style={{ color: "#777", fontSize: 13 }}>
        Logged in as: {user?.email}
      </p>

      {message && (
        <p
          style={{
            padding: 12,
            background: "#f2eee6",
            borderRadius: 8,
            overflowWrap: "anywhere",
          }}
        >
          {message}
        </p>
      )}

      {isAdmin && (
        <section
          style={{
            display: "flex",
            gap: 15,
            flexWrap: "wrap",
            margin: "25px 0",
          }}
        >
          <div style={statStyle}>
            <h2>{profiles.length}</h2>
            <p>Total Profiles</p>
          </div>
          <div style={statStyle}>
            <h2>{profiles.filter((p) => p.is_published).length}</h2>
            <p>Published</p>
          </div>
          <div style={statStyle}>
            <h2>{profiles.filter((p) => !p.is_published).length}</h2>
            <p>Unpublished</p>
          </div>
        </section>
      )}

      <section
        style={{
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: 14,
          padding: 20,
          marginTop: 25,
        }}
      >
        <h2>{editingId ? "Edit Profile" : "Create Business Profile"}</h2>

        <form onSubmit={saveProfile}>
          {isAdmin && !editingId && (
            <>
              <label>Customer Supabase User ID *</label>
              <input
                style={inputStyle}
                value={form.id}
                onChange={(e) => updateField("id", e.target.value)}
                placeholder="Paste the customer's Auth User ID"
                required
              />
              <small style={{ color: "#777" }}>
                The customer must already have registered and verified
                their account.
              </small>
            </>
          )}

          <label>Business Name *</label>
          <input
            style={inputStyle}
            value={form.business_name}
            onChange={(e) => updateField("business_name", e.target.value)}
            placeholder="Example: ABC Salon"
            required
          />

          <label>Profile URL Slug</label>
          <input
            style={inputStyle}
            value={form.slug}
            onChange={(e) => updateField("slug", e.target.value)}
            placeholder="abc-salon"
          />

          <label>Business Category</label>
          <input
            style={inputStyle}
            value={form.category || ""}
            onChange={(e) => updateField("category", e.target.value)}
            placeholder="Salon, Restaurant, Clothing Store..."
          />

          <label>Business Description</label>
          <textarea
            style={inputStyle}
            value={form.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
            placeholder="Tell customers about your business"
          />

          <label>WhatsApp Number</label>
          <input
            style={inputStyle}
            value={form.whatsapp || ""}
            onChange={(e) => updateField("whatsapp", e.target.value)}
            placeholder="91XXXXXXXXXX"
          />

          <label>Instagram URL</label>
          <input
            style={inputStyle}
            value={form.instagram_url || ""}
            onChange={(e) => updateField("instagram_url", e.target.value)}
            placeholder="https://instagram.com/yourbusiness"
          />

          <label>Google Review URL</label>
          <input
            style={inputStyle}
            value={form.google_review_url || ""}
            onChange={(e) =>
              updateField("google_review_url", e.target.value)
            }
            placeholder="https://g.page/r/..."
          />

          <label>Website URL</label>
          <input
            style={inputStyle}
            value={form.website_url || ""}
            onChange={(e) => updateField("website_url", e.target.value)}
            placeholder="https://yourwebsite.com"
          />

          <label>Business Location</label>
          <input
            style={inputStyle}
            value={form.location || ""}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="Jamui, Bihar"
          />

          <label>Business Logo URL</label>
          <input
            style={inputStyle}
            value={form.logo_url || ""}
            onChange={(e) => updateField("logo_url", e.target.value)}
            placeholder="https://..."
          />

          <label style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) =>
                updateField("is_published", e.target.checked)
              }
            />
            Publish this business profile
          </label>

          <button
            type="submit"
            disabled={saving}
            style={buttonStyle}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>

          {editingId && isAdmin && (
            <button
              type="button"
              onClick={newProfile}
              style={{ ...buttonStyle, marginLeft: 10, background: "#777" }}
            >
              Cancel Edit
            </button>
          )}
        </form>

        {editingId && form.slug && (
          <p style={{ marginTop: 20 }}>
            Public profile:{" "}
            <a
              href={`/p/${form.slug}`}
              target="_blank"
              rel="noreferrer"
            >
              View Profile
            </a>
          </p>
        )}
      </section>

      {isAdmin ? (
        <section style={{ marginTop: 35 }}>
          <h2>Customer Profiles</h2>

          <input
            style={inputStyle}
            placeholder="Search businesses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {visibleProfiles.map((profile) => (
            <div key={profile.id} style={profileStyle}>
              <div style={{ minWidth: 0 }}>
                <strong>{profile.business_name}</strong>
                <p style={{ color: "#777", fontSize: 13 }}>
                  /p/{profile.slug} ·{" "}
                  {profile.is_published ? "Published" : "Unpublished"}
                </p>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  style={buttonStyle}
                  onClick={() => editProfile(profile)}
                >
                  Edit
                </button>
                <button
                  style={{ ...buttonStyle, background: "#a83232" }}
                  onClick={() => deleteProfile(profile.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {visibleProfiles.length === 0 && (
            <p style={{ color: "#777" }}>No customer profiles found.</p>
          )}
        </section>
      ) : (
        <section style={{ marginTop: 30 }}>
          <h2>My Digital Profile</h2>
          <p style={{ color: "#777" }}>
            Update your details above. Your NFC card and QR code will
            open your public profile once published.
          </p>
        </section>
      )}
    </main>
  );
}

const statStyle: React.CSSProperties = {
  background: "#f5f3ef",
  padding: "12px 20px",
  borderRadius: 10,
  minWidth: 110,
};

const profileStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 12,
  padding: 15,
  marginBottom: 10,
  border: "1px solid #eee",
  borderRadius: 10,
};


