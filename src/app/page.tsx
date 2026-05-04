"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import GoldTicker from "@/components/GoldTicker";
import JewelryCard from "@/components/JewelryCard";
import { getOrnaments } from "@/lib/database";
import { Ornament } from "@/lib/types";

export default function CatalogPage() {
  const [ornaments, setOrnaments] = useState<Ornament[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [purityFilter, setPurityFilter] = useState<string>("All");

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

  const categories = ["All", "Necklace", "Ring", "Earring", "Bracelet", "Pendant", "Bangle"];
  
  const filtered = ornaments.filter(o => {
    const matchesCategory = activeCategory === "All" || o.category === activeCategory;
    const matchesSearch = o.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPurity = purityFilter === "All" || o.carats.toString() === purityFilter;
    
    return matchesCategory && matchesSearch && matchesPurity;
  });

  return (
    <>
      <GoldTicker />
      <Navbar />

      <main className="container section">
        <div className="text-center mb-8">
          <h1 className="text-display-md mb-4">Curated Collection</h1>
          <p className="text-body-lg text-muted" style={{ maxWidth: "600px", margin: "0 auto" }}>
            Explore our handcrafted masterpieces. Every piece tells a story of heritage and luxury.
          </p>
        </div>

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

        <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginBottom: "32px", flexWrap: "wrap" }}>
          <input 
            type="text" 
            placeholder="Search ornaments..." 
            className="input-field" 
            style={{ maxWidth: "300px" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select 
            className="input-select" 
            style={{ maxWidth: "150px" }}
            value={purityFilter}
            onChange={(e) => setPurityFilter(e.target.value)}
          >
            <option value="All">All Purity</option>
            <option value="18">18K</option>
            <option value="20">20K</option>
            <option value="22">22K</option>
            <option value="24">24K</option>
          </select>
        </div>

        {loading ? (
          <div className="grid-catalog mt-8">
            {Array(6).fill(null).map((_, i) => (
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
          <div className="text-center mt-8 text-muted py-12">
            No items found in this category.
          </div>
        ) : (
          <div className="grid-catalog mt-8">
            {filtered.map((ornament) => (
              <JewelryCard key={ornament.id} ornament={ornament} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
