import Link from "next/link";
import Image from "next/image";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          {/* Brand & Socials */}
          <div className="footer-brand-col">
            <Link href="/" style={{ display: 'inline-block', marginBottom: 'var(--space-6)' }}>
              <Image
                src="/logo.png"
                alt="Shete Jewellers"
                width={160}
                height={55}
                style={{ objectFit: 'contain' }}
              />
            </Link>
            <p className="text-body-md" style={{ color: 'var(--color-outline-var)', marginBottom: 'var(--space-6)', maxWidth: '300px' }}>
              Exquisite handcrafted gold jewelry. Celebrating luxury, purity, and bespoke artisanship since 1993.
            </p>
            {WHATSAPP_NUMBER && (
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-label-sm"
                style={{ color: '#25D366', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.096.541 4.063 1.488 5.777L0 24l6.305-1.654A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.007-1.37l-.36-.214-3.732.979.995-3.638-.234-.374A9.818 9.818 0 1 1 12 21.818z"/></svg>
                Chat on WhatsApp
              </a>
            )}
          </div>

          {/* Quick Links */}
          <div className="footer-links-col">
            <h3 className="text-label-lg" style={{ color: 'var(--color-gold)', marginBottom: 'var(--space-4)' }}>Know Us</h3>
            <nav>
              <Link href="/about">Our Story</Link>
              <Link href="/contact">Contact Us</Link>
              <Link href="/contact">Store Location</Link>
            </nav>
          </div>

          {/* Policies */}
          <div className="footer-links-col">
            <h3 className="text-label-lg" style={{ color: 'var(--color-gold)', marginBottom: 'var(--space-4)' }}>Promises & Policies</h3>
            <nav>
              <Link href="/about">Our Promises</Link>
              <Link href="/">Browse Catalog</Link>
            </nav>
          </div>

        </div>

        <div className="footer-bottom">
          <p className="text-label-sm" style={{ color: 'var(--color-outline-var)' }}>
            © {new Date().getFullYear()}, Shete Jewellers. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
