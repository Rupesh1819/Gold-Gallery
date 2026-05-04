import Link from "next/link";
import Image from "next/image";

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
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" aria-label="Youtube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-col">
            <h3 className="text-label-lg" style={{ color: 'var(--color-gold)', marginBottom: 'var(--space-4)' }}>Know Us</h3>
            <nav>
              <Link href="#">Our Story</Link>
              <Link href="#">Contact Us</Link>
              <Link href="#">Store Locator</Link>
              <Link href="#">Careers</Link>
            </nav>
          </div>

          {/* Policies */}
          <div className="footer-links-col">
            <h3 className="text-label-lg" style={{ color: 'var(--color-gold)', marginBottom: 'var(--space-4)' }}>Promises & Policies</h3>
            <nav>
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Terms & Conditions</Link>
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
