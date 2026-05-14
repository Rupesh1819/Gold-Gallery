"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoldTicker from "@/components/GoldTicker";
import { Gem, Shield, Heart, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <GoldTicker />
      <Navbar />

      <main className="container">
        {/* Hero */}
        <section className="about-hero">
          <div className="hero-eyebrow" style={{ color: "var(--color-gold)" }}>Our Story</div>
          <h1 className="text-display-md mb-6">Crafting Legacy,<br />One Jewel at a Time</h1>
          <p className="text-body-lg text-muted" style={{ maxWidth: "600px", margin: "0 auto" }}>
            Since 1993, Shete Jewellers has been a trusted name in handcrafted gold jewelry.
            Rooted in tradition and driven by artistry, we bring you pieces that transcend time.
          </p>
        </section>

        {/* Story */}
        <section style={{ maxWidth: "800px", margin: "0 auto", padding: "0 0 var(--space-16)" }}>
          <div className="divider"></div>
          <h2 className="text-headline-md mb-6 text-center">A Heritage of Excellence</h2>
          <p className="text-body-lg text-muted mb-6" style={{ lineHeight: "1.8" }}>
            What began as a small family workshop has grown into a beloved destination for those who appreciate
            the art of fine gold jewelry. Our founder envisioned a place where traditional craftsmanship meets
            contemporary elegance — and that vision continues to guide every piece we create.
          </p>
          <p className="text-body-lg text-muted mb-6" style={{ lineHeight: "1.8" }}>
            Every ornament at Shete Jewellers passes through the hands of master artisans who have
            dedicated their lives to perfecting their craft. We source only the finest gold, ensuring
            that each piece meets our exacting standards of purity and beauty.
          </p>
          <p className="text-body-lg text-muted" style={{ lineHeight: "1.8" }}>
            Today, we proudly serve customers who value authenticity, quality, and the timeless
            appeal of handcrafted gold jewelry. Our commitment remains unchanged: to create
            jewelry that becomes a part of your story.
          </p>
        </section>

        {/* Values */}
        <section style={{ paddingBottom: "var(--space-16)" }}>
          <h2 className="text-headline-md mb-4 text-center">Our Promises</h2>
          <p className="text-body-md text-muted text-center mb-8" style={{ maxWidth: "500px", margin: "0 auto var(--space-8)" }}>
            The pillars that define everything we do.
          </p>
          <div className="about-grid">
            {[
              { icon: <Gem size={32} />, title: "Pure Gold", desc: "Every piece is crafted with certified purity. We guarantee BIS Hallmarked gold in 18K, 22K, and 24K." },
              { icon: <Heart size={32} />, title: "Handcrafted", desc: "Each ornament is meticulously handcrafted by master artisans with decades of experience." },
              { icon: <Shield size={32} />, title: "Transparent Pricing", desc: "Real-time gold rates, clear making charges, and no hidden costs. What you see is what you pay." },
              { icon: <Award size={32} />, title: "Trust & Legacy", desc: "Over 30 years of trusted service. We are proud of the relationships we have built with our customers." },
            ].map((item) => (
              <div key={item.title} className="about-card">
                <div style={{ color: "var(--color-gold)", marginBottom: "var(--space-4)" }}>{item.icon}</div>
                <h3 className="text-headline-md mb-4">{item.title}</h3>
                <p className="text-body-md text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ textAlign: "center", padding: "var(--space-12) 0 var(--space-16)", borderTop: "var(--border-hairline)" }}>
          <h2 className="text-headline-md mb-4">Ready to Explore?</h2>
          <p className="text-body-lg text-muted mb-8">Discover our curated collection of handcrafted masterpieces.</p>
          <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/" className="btn btn-primary">Browse Collection</Link>
            <Link href="/contact" className="btn btn-secondary">Get in Touch</Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
