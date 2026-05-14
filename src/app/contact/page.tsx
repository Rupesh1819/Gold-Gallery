"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoldTicker from "@/components/GoldTicker";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

export default function ContactPage() {
  return (
    <>
      <GoldTicker />
      <Navbar />

      <main className="container section">
        <div className="text-center mb-8">
          <div className="hero-eyebrow" style={{ color: "var(--color-gold)" }}>Get in Touch</div>
          <h1 className="text-display-md mb-4">Visit Our Store</h1>
          <p className="text-body-lg text-muted" style={{ maxWidth: "560px", margin: "0 auto" }}>
            We would love to welcome you. Visit us in person or reach out through any of the channels below.
          </p>
        </div>

        <div className="contact-grid">
          {/* Contact Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div className="contact-info-card">
              <div className="contact-info-icon"><MapPin size={20} /></div>
              <div>
                <h3 className="text-label-lg mb-2">Store Address</h3>
                <p className="text-body-md text-muted">
                  Shete Jewellers<br />
                  Main Road, Market Area<br />
                  Maharashtra, India
                </p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon"><Phone size={20} /></div>
              <div>
                <h3 className="text-label-lg mb-2">Phone</h3>
                <p className="text-body-md text-muted">
                  {WHATSAPP_NUMBER ? `+${WHATSAPP_NUMBER.slice(0, 2)} ${WHATSAPP_NUMBER.slice(2)}` : "+91 XXXX XXXXXX"}
                </p>
                {WHATSAPP_NUMBER && (
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-label-sm"
                    style={{ color: "#25D366", marginTop: "4px", display: "inline-block" }}
                  >
                    Chat on WhatsApp →
                  </a>
                )}
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon"><Mail size={20} /></div>
              <div>
                <h3 className="text-label-lg mb-2">Email</h3>
                <p className="text-body-md text-muted">info@shetejewellers.com</p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon"><Clock size={20} /></div>
              <div>
                <h3 className="text-label-lg mb-2">Business Hours</h3>
                <p className="text-body-md text-muted">
                  Monday – Saturday: 10:00 AM – 8:00 PM<br />
                  Sunday: 10:00 AM – 2:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* Map placeholder / Contact form */}
          <div>
            <div style={{
              background: "var(--color-surface-container)",
              border: "var(--border-hairline)",
              padding: "var(--space-8)",
              textAlign: "center",
              minHeight: "300px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "var(--space-4)",
              marginBottom: "var(--space-6)"
            }}>
              <MapPin size={40} style={{ color: "var(--color-gold)" }} />
              <h3 className="text-headline-md">Find Us</h3>
              <p className="text-body-md text-muted">Visit our store for the full experience of our curated collection.</p>
            </div>

            {/* Quick contact form */}
            <div style={{ border: "var(--border-hairline)", padding: "var(--space-8)" }}>
              <h3 className="text-label-lg mb-6">Send Us a Message</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const name = (form.elements.namedItem("name") as HTMLInputElement).value;
                  const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;
                  window.open(`mailto:info@shetejewellers.com?subject=Inquiry from ${name}&body=${encodeURIComponent(message)}`);
                }}
                style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}
              >
                <div className="input-group">
                  <label className="input-label">Your Name</label>
                  <input type="text" name="name" required className="input-field" />
                </div>
                <div className="input-group">
                  <label className="input-label">Message</label>
                  <textarea name="message" required className="input-field" rows={4}></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
