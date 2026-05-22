"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoldTicker from "@/components/GoldTicker";
import JewelryCard from "@/components/JewelryCard";
import { getOrnaments } from "@/lib/database";
import { Ornament } from "@/lib/types";
import { useGoldPrice } from "@/context/GoldPriceContext";
import { ArrowUp, Search } from "lucide-react";

type SortOption = "newest" | "price-low" | "price-high" | "weight";

export default function CatalogPage() {
  const [ornaments, setOrnaments] = useState<Ornament[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [purityFilter, setPurityFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { calculatePrice } = useGoldPrice();

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getOrnaments();
        setOrnaments(data);
      } catch (err) {
        console.error("Failed to load ornaments:", err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  // Back to top visibility
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = ["All", "Necklace", "Ring", "Earring", "Bracelet", "Pendant", "Bangle"];

  const filtered = ornaments
    .filter((o) => {
      const matchesCategory = activeCategory === "All" || o.category === activeCategory;
      const matchesSearch =
        o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPurity = purityFilter === "All" || o.carats.toString() === purityFilter;
      return matchesCategory && matchesSearch && matchesPurity;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low": {
          const pa = calculatePrice(a.carats, a.weightGrams, a.makingChargePercent).estimatedPrice;
          const pb = calculatePrice(b.carats, b.weightGrams, b.makingChargePercent).estimatedPrice;
          return pa - pb;
        }
        case "price-high": {
          const pa = calculatePrice(a.carats, a.weightGrams, a.makingChargePercent).estimatedPrice;
          const pb = calculatePrice(b.carats, b.weightGrams, b.makingChargePercent).estimatedPrice;
          return pb - pa;
        }
        case "weight":
          return b.weightGrams - a.weightGrams;
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  return (
    <>
      <GoldTicker />
      <Navbar />

      {/* ═══ HERO SECTION ═══ */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-eyebrow">Since 1993</div>
          <h1 className="hero-title">
            Where <em>Gold</em> Meets<br />Artistry
          </h1>
          <p className="hero-subtitle">
            Discover handcrafted masterpieces that celebrate heritage, purity, and timeless elegance. Every piece tells a story.
          </p>
          <div className="hero-actions">
            <a href="#collection" className="btn btn-primary">Explore Collection</a>
            <Link href="/about" className="btn btn-secondary">Our Story</Link>
          </div>
          <div className="hero-stats">
            <div>
              <span className="hero-stat-value">30+</span>
              <span className="hero-stat-label">Years Legacy</span>
            </div>
            <div>
              <span className="hero-stat-value">500+</span>
              <span className="hero-stat-label">Designs</span>
            </div>
            <div>
              <span className="hero-stat-value">99.9%</span>
              <span className="hero-stat-label">Purity</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CATALOG ═══ */}
      <main id="collection" className="container section">
        <div className="text-center mb-8">
          <h2 className="text-display-md mb-4">Curated Collection</h2>
          <p className="text-body-lg text-muted" style={{ maxWidth: "600px", margin: "0 auto" }}>
            Explore our handcrafted masterpieces. Every piece tells a story of heritage and luxury.
          </p>
        </div>

        {/* Category Filters */}
        <div className="filter-bar" style={{ justifyContent: "center" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-chip ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search, Purity & Sort */}
        <div className="catalog-controls">
          <div className="search-wrapper">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search ornaments..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="select-group">
            <select
              className="input-select"
              value={purityFilter}
              onChange={(e) => setPurityFilter(e.target.value)}
            >
              <option value="All">All Purity</option>
              <option value="18">18K</option>
              <option value="20">20K</option>
              <option value="22">22K</option>
              <option value="24">24K</option>
            </select>
            <select
              className="input-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="weight">Heaviest First</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="sort-bar" style={{ justifyContent: "center", marginBottom: "var(--space-6)" }}>
          <span className="results-count">
            {loading ? "Loading..." : `${filtered.length} item${filtered.length !== 1 ? "s" : ""} found`}
          </span>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid-catalog">
            {Array(8).fill(null).map((_, i) => (
              <div key={i} className="card">
                <div className="skeleton" style={{ aspectRatio: "3/4" }}></div>
                <div className="card-body">
                  <div className="skeleton mb-2" style={{ height: "14px", width: "50%", margin: "0 auto" }}></div>
                  <div className="skeleton mb-2" style={{ height: "20px", width: "80%", margin: "0 auto" }}></div>
                  <div className="skeleton" style={{ height: "24px", width: "40%", margin: "0 auto" }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center mt-8 text-muted" style={{ padding: "80px 0" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>💎</div>
            <p className="text-body-lg">No items found matching your criteria.</p>
            <button className="btn btn-secondary mt-4" onClick={() => { setActiveCategory("All"); setSearchQuery(""); setPurityFilter("All"); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid-catalog">
            {filtered.map((ornament) => (
              <JewelryCard key={ornament.id} ornament={ornament} />
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Back to Top */}
      <button
        className={`back-to-top ${showBackToTop ? "visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        <ArrowUp size={20} />
      </button>
    </>
  );
}
