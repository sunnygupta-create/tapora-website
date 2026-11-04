
type Profile = {
  name: string;
  category: string;
  description: string;
  location: string;
  whatsapp: string;
};

const profiles: Record<string, Profile> = {
  tapora: {
    name: "TAPORA",
    category: "Smart Business Solutions",
    description:
      "Smart NFC business cards and digital profiles. One tap, endless possibilities.",
    location: "Jamui, Bihar",
    whatsapp: "919334578433"
  }
};

export default async function ProfilePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = profiles[slug.toLowerCase()];

  if (!profile) {
    return (
      <main style={styles.page}>
        <h1>Profile not found</h1>
        <p>This digital business profile does not exist.</p>
        <a href="/">Visit TAPORA</a>
      </main>
    );
  }

  const profileUrl =
    `https://tapora-website-phi.vercel.app/p/${slug}`;

  const whatsappUrl =
    `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(
      "Hi TAPORA! I want to know more about your products."
    )}`;

  const qrUrl =
    `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(profileUrl)}`;

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>T.</div>

        <h1 style={styles.name}>{profile.name}</h1>
        <p style={styles.category}>{profile.category}</p>

        <p style={styles.description}>
          {profile.description}
        </p>

        <a href={whatsappUrl} style={styles.button}>
          WhatsApp
        </a>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.location)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.secondary}
        >
          View Location
        </a>

        <div style={styles.qrBox}>
          <p>SCAN TO OPEN PROFILE</p>
         <img
  src={qrUrl}
  alt="TAPORA profile QR code"
  width="180"
  height="180"
  style={{ display: "block", margin: "12px auto" }}
/>
<small style={{
  display: "block",
  overflowWrap: "anywhere",
  lineHeight: 1.5
}}>
  {profileUrl}
</small> 
        </div>

        <p style={styles.footer}>
          Powered by TAPORA
        </p>
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
    fontFamily: "Arial, sans-serif"
  },
  card: {
    background: "#fff",
    width: "100%",
    maxWidth: "420px",
    borderRadius: "18px",
    padding: "35px 25px",
    textAlign: "center",
    boxShadow: "0 10px 40px #00000012"
  },
  logo: {
    width: "65px",
    height: "65px",
    margin: "auto",
    background: "#171717",
    color: "#fff",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    fontSize: "30px",
    fontWeight: "bold"
  },
  name: {
    fontSize: "30px",
    marginBottom: "5px",
    letterSpacing: "2px"
  },
  category: {
    color: "#a18451",
    fontWeight: "bold",
    fontSize: "13px"
  },
  description: {
    color: "#666",
    lineHeight: 1.7,
    margin: "25px 0"
  },
  button: {
    display: "block",
    background: "#171717",
    color: "white",
    padding: "15px",
    borderRadius: "8px",
    textDecoration: "none",
    marginBottom: "12px"
  },
  secondary: {
    display: "block",
    border: "1px solid #ddd",
    color: "#171717",
    padding: "14px",
    borderRadius: "8px",
    textDecoration: "none"
  },
  qrBox: {
    marginTop: "30px",
    padding: "20px",
    background: "#faf9f6",
    borderRadius: "12px"
  },
  footer: {
    color: "#999",
    fontSize: "12px",
    marginTop: "25px"
  }
};
