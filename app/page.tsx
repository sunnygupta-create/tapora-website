
const products = [
  {
    icon: "💳",
    name: "NFC Smart Business Card",
    description: "One tap. Your entire digital business identity.",
    price: "₹249",
    tag: "MOST POPULAR"
  },
  {
    icon: "⭐",
    name: "Google Review Stand",
    description: "Make it easier for customers to find and review your business.",
    price: "₹399",
    tag: "FOR BUSINESSES"
  },
  {
    icon: "✨",
    name: "Smart Business Combo",
    description: "Get an NFC card and review stand together.",
    price: "₹599",
    tag: "BEST VALUE"
  }
];

export default function Home() {
  return (
    <main>
      <div className="container">
        <nav>
          <a href="/" className="logo">TAPORA.</a>
          <a href="#products" className="btn">Explore Products ↗</a>
        </nav>

        <section className="hero">
          <div className="eyebrow">THE FUTURE OF BUSINESS NETWORKING</div>
          <h1>One tap.<br />Endless possibilities.</h1>
          <p>
            Make your business unforgettable with smart NFC
            business cards and digital review solutions.
            No apps. No hassle. Just one tap.
          </p>
          <a href="#products" className="btn">
            Explore Collection →
          </a>
          <a href="#how" className="btn btn-outline">
            How it works
          </a>
        </section>

        <section className="section" id="products">
          <div className="eyebrow">OUR COLLECTION</div>
          <h2 className="section-title">Smart tools for modern businesses.</h2>
          <p className="section-desc">
            Simple technology. Professional impression.
          </p>

          <div className="products">
            {products.map((product) => (
              <div className="product" key={product.name}>
                <div className="product-icon">{product.icon}</div>
                <div className="eyebrow">{product.tag}</div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="price">{product.price}</div>
                <a
                  className="btn"
                  href="#contact"
                >
                  Enquire Now →
                </a>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="how">
          <div className="eyebrow">HOW IT WORKS</div>
          <h2 className="section-title">Your business. One tap away.</h2>
          <div className="products">
            <div className="product">
              <div className="product-icon">01</div>
              <h3>Tap</h3>
              <p>Customer taps your NFC card or scans its QR code.</p>
            </div>
            <div className="product">
              <div className="product-icon">02</div>
              <h3>Connect</h3>
              <p>Your digital business profile opens instantly.</p>
            </div>
            <div className="product">
              <div className="product-icon">03</div>
              <h3>Grow</h3>
              <p>Customers discover your links and connect with you.</p>
            </div>
          </div>
        </section>

        <section className="section" id="contact">
          <div className="eyebrow">LET'S CONNECT</div>
          <h2 className="section-title">Ready to make the switch?</h2>
          <p className="section-desc">
            Contact TAPORA for customised smart business cards
            and Google review stands.
          </p>
          <a className="btn" href="mailto:hello@tapora.in">
            Contact Us →
          </a>
          <p style={{ marginTop: 15, color: "#777" }}>
            Serving businesses in Jamui, Bihar.
          </p>
        </section>
      </div>

      <footer>
        <div className="container">
          <div className="logo">TAPORA.</div>
          <p>Smart Connections. Simplified.</p>
          <p>© 2026 TAPORA. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
