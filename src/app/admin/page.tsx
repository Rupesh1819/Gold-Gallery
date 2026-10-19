"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { supabase } from "@/lib/supabase";
import {
  getOrnaments, addOrnament, deleteOrnament,
  getGoldRateSettings, updateGoldRateSettings, updateOrnament
} from "@/lib/database";
import { Ornament, GoldRateSettings } from "@/lib/types";
import { useGoldPrice } from "@/context/GoldPriceContext";
import { useToast } from "@/context/ToastContext";
import { Trash2, Pencil, X, Download, Search, CheckCircle2, AlertCircle, Clock } from "lucide-react";

export default function AdminDashboard() {
  const [ornaments, setOrnaments] = useState<Ornament[]>([]);
  const [settings, setSettings] = useState<GoldRateSettings>({ manual_rate: 15200, last_updated: new Date(), updated_by: "" });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [inventorySearch, setInventorySearch] = useState("");
  const itemsPerPage = 10;
  const { showToast } = useToast();
  const { calculatePrice, refreshRates } = useGoldPrice();

  // Pricing control states
  const [rate22kInput, setRate22kInput] = useState("");
  const [rate24kInput, setRate24kInput] = useState("");
  const [isSavingRates, setIsSavingRates] = useState(false);
  const [pricingError, setPricingError] = useState<string | null>(null);
  const [pricingSuccess, setPricingSuccess] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [carats, setCarats] = useState<18 | 20 | 22 | 24>(22);
  const [weight, setWeight] = useState("");
  const [category, setCategory] = useState<Ornament["category"]>("Necklace");
  const [makingCharge, setMakingCharge] = useState("12");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLimited, setIsLimited] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchData(); }, []);

  // Image preview
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [orns, sets] = await Promise.all([getOrnaments(), getGoldRateSettings()]);
      setOrnaments(orns);
      if (sets) {
        setSettings(sets);
        const r22 = sets.manual_rate_22k || sets.manual_rate;
        if (r22) setRate22kInput(r22.toString());
        if (sets.manual_rate_24k) setRate24kInput(sets.manual_rate_24k.toString());
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGoldRates = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPricingError(null);
    setPricingSuccess(null);

    // 1. Validation to reject empty, invalid, zero, or negative rates
    const trimmed22k = rate22kInput.trim();
    const trimmed24k = rate24kInput.trim();

    if (!trimmed22k) {
      setPricingError("Please enter a valid 22K Gold Rate.");
      return;
    }
    const val22 = parseFloat(trimmed22k);
    if (isNaN(val22) || val22 <= 0) {
      setPricingError("22K Gold Rate must be a valid positive number greater than 0.");
      return;
    }

    if (!trimmed24k) {
      setPricingError("Please enter a valid 24K Gold Rate.");
      return;
    }
    const val24 = parseFloat(trimmed24k);
    if (isNaN(val24) || val24 <= 0) {
      setPricingError("24K Gold Rate must be a valid positive number greater than 0.");
      return;
    }

    setIsSavingRates(true);

    try {
      // Retrieve auth token from the active Supabase session
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      let apiSuccess = false;
      if (token) {
        try {
          const res = await fetch("/api/gold-rate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ rate22k: val22, rate24k: val24 }),
          });

          const resData = await res.json();
          if (res.ok && resData.success) {
            apiSuccess = true;
          } else if (!res.ok && resData.error) {
            throw new Error(resData.error);
          }
        } catch (fetchErr: unknown) {
          console.warn("API route call failed, attempting direct database update:", fetchErr);
        }
      }

      if (!apiSuccess) {
        // Direct database update using authenticated Supabase client
        await updateGoldRateSettings({
          manual_rate: val22,
          manual_rate_22k: val22,
          manual_rate_24k: val24,
          use_manual: true,
          updated_by: sessionData.session?.user?.email || null,
        });
      }

      await fetchData();
      await refreshRates();
      setPricingSuccess(
        `Gold rates saved successfully! 22K: ₹${val22.toLocaleString("en-IN")}/g | 24K: ₹${val24.toLocaleString("en-IN")}/g`
      );
      showToast("Gold rates saved successfully!", "success");
    } catch (err: unknown) {
      console.error("Gold rate update error:", err);
      let message = "Failed to update gold rates";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "object" && err !== null) {
        message = (err as any).message || (err as any).error_description || JSON.stringify(err);
      } else if (typeof err === "string") {
        message = err;
      }
      setPricingError(message);
      showToast("Error updating rates: " + message, "error");
    } finally {
      setIsSavingRates(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile && !editingId) { showToast("Please select an image", "error"); return; }
    setSubmitting(true);

    try {
      let imageUrl = editingId ? ornaments.find(o => o.id === editingId)?.imageUrl || "" : "";

      if (imageFile) {
        const compressedFile = await imageCompression(imageFile, {
          maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true
        });
        const fileName = `${Date.now()}_${compressedFile.name}`;
        const { error: uploadError } = await supabase.storage.from('ornaments').upload(fileName, compressedFile);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('ornaments').getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }

      const payload = {
        name, description: desc, carats,
        weightGrams: parseFloat(weight), category, imageUrl,
        inStock: true, isLimitedEdition: isLimited,
        makingChargePercent: parseFloat(makingCharge)
      };

      if (editingId) {
        await updateOrnament(editingId, payload);
      } else {
        await addOrnament(payload);
      }

      setEditingId(null);
      setName(""); setDesc(""); setWeight(""); setImageFile(null);
      await fetchData();
      showToast(`Ornament ${editingId ? "updated" : "added"} successfully!`, "success");
    } catch (err) {
      console.error(err);
      showToast(`Failed to ${editingId ? "update" : "add"} ornament.`, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (o: Ornament) => {
    setEditingId(o.id); setName(o.name); setCategory(o.category);
    setWeight(o.weightGrams.toString()); setCarats(o.carats);
    setMakingCharge(o.makingChargePercent.toString()); setIsLimited(o.isLimitedEdition);
    setDesc(o.description); setImageFile(null);
    window.scrollTo({ top: document.getElementById('inventory')?.offsetTop || 0, behavior: 'smooth' });
  };

  const cancelEdit = () => { setEditingId(null); setName(""); setDesc(""); setWeight(""); setImageFile(null); };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    await deleteOrnament(id);
    await fetchData();
    showToast("Ornament deleted", "info");
  };

  const handleStockToggle = async (o: Ornament) => {
    try {
      await updateOrnament(o.id, { inStock: !o.inStock });
      await fetchData();
      showToast(`${o.name} marked as ${!o.inStock ? "In Stock" : "Out of Stock"}`, "success");
    } catch {
      showToast("Failed to update stock status", "error");
    }
  };

  const exportCSV = () => {
    const headers = ["Name", "Category", "Carats", "Weight(g)", "Making(%)", "InStock", "Limited"];
    const rows = ornaments.map(o => [o.name, o.category, o.carats, o.weightGrams, o.makingChargePercent, o.inStock, o.isLimitedEdition]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "inventory.csv"; a.click();
    URL.revokeObjectURL(url);
    showToast("CSV exported!", "success");
  };

  // Stats
  const totalItems = ornaments.length;
  const outOfStock = ornaments.filter(o => !o.inStock).length;
  const categories = new Set(ornaments.map(o => o.category));
  const totalValue = ornaments.reduce((sum, o) => {
    return sum + calculatePrice(o.carats, o.weightGrams, o.makingChargePercent).estimatedPrice;
  }, 0);

  // Filtered inventory
  const searchedOrnaments = ornaments.filter(o =>
    o.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    o.category.toLowerCase().includes(inventorySearch.toLowerCase())
  );
  const totalPages = Math.ceil(searchedOrnaments.length / itemsPerPage);
  const currentOrnaments = searchedOrnaments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="container" style={{ paddingTop: "var(--space-8)" }}>

      {/* STATS */}
      <section className="mb-12">
        <h2 className="text-headline-md mb-6">Dashboard Overview</h2>
        <div className="stats-grid">
          {[
            { label: "Total Items", value: totalItems },
            { label: "Categories", value: categories.size },
            { label: "Out of Stock", value: outOfStock },
            { label: "Inventory Value", value: `₹${totalValue.toLocaleString("en-IN")}` },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ GOLD RATE MANAGEMENT (PRICING CONTROL) ═══ */}
      <section id="pricing" className="mb-12">
        <div className="section-header" style={{ marginBottom: "var(--space-4)" }}>
          <div>
            <h2 className="text-headline-md">Gold Rate Management</h2>
            <p className="text-body-md text-muted" style={{ marginTop: "4px" }}>
              Configure daily 22K and 24K gold rates displayed on the public &ldquo;Rate of the Day&rdquo; section and used for jewelry price calculations.
            </p>
          </div>
        </div>

        <div className="admin-pricing-card" style={{ maxWidth: "720px" }}>
          {/* Success Banner */}
          {pricingSuccess && (
            <div className="admin-alert-banner success" role="status">
              <CheckCircle2 size={18} />
              <span>{pricingSuccess}</span>
            </div>
          )}

          {/* Error Banner */}
          {pricingError && (
            <div className="admin-alert-banner error" role="alert">
              <AlertCircle size={18} />
              <span>{pricingError}</span>
            </div>
          )}

          <form onSubmit={handleSaveGoldRates}>
            <div className="pricing-fields-grid">
              {/* Field 1: 22K Gold Rate */}
              <div className="input-group">
                <label className="input-label" htmlFor="input-rate-22k" style={{ display: "flex", alignItems: "center" }}>
                  <span>22K Gold Rate (₹/g)</span>
                  <span className="pricing-helper-badge">Purity: 916</span>
                </label>
                <input
                  id="input-rate-22k"
                  type="number"
                  step="1"
                  min="1"
                  required
                  placeholder="e.g. 15200"
                  className="input-field"
                  disabled={isSavingRates}
                  value={rate22kInput}
                  onChange={(e) => {
                    setRate22kInput(e.target.value);
                    if (pricingError) setPricingError(null);
                  }}
                />
              </div>

              {/* Field 2: 24K Gold Rate */}
              <div className="input-group">
                <label className="input-label" htmlFor="input-rate-24k" style={{ display: "flex", alignItems: "center" }}>
                  <span>24K Gold Rate (₹/g)</span>
                  <span className="pricing-helper-badge">Purity: 999</span>
                </label>
                <input
                  id="input-rate-24k"
                  type="number"
                  step="1"
                  min="1"
                  required
                  placeholder="e.g. 16580"
                  className="input-field"
                  disabled={isSavingRates}
                  value={rate24kInput}
                  onChange={(e) => {
                    setRate24kInput(e.target.value);
                    if (pricingError) setPricingError(null);
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
              <button
                type="submit"
                id="btn-save-gold-rates"
                className="btn btn-primary"
                disabled={isSavingRates}
              >
                {isSavingRates ? "Saving Gold Rates..." : "Save Gold Rates"}
              </button>
            </div>
          </form>

          {/* Pricing Meta & Timestamp */}
          <div className="admin-pricing-meta">
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Clock size={13} />
              {settings.last_updated
                ? `Last updated: ${new Date(settings.last_updated).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}`
                : "No saved timestamp"}
            </span>
            {settings.updated_by && (
              <span>Updated by: {settings.updated_by}</span>
            )}
          </div>
        </div>
      </section>

      {/* QUICK ADD / EDIT */}
      <section id="inventory" className="mb-12">
        <h2 className="text-headline-md mb-6">{editingId ? "Edit Ornament" : "Quick Add Ornament"}</h2>
        <div className="card" style={{ padding: "var(--space-8)" }}>
          <form onSubmit={handleAddSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }}>
            <div className="input-group">
              <label className="input-label">Name</label>
              <input required type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Category</label>
              <select className="input-select" value={category} onChange={e => setCategory(e.target.value as any)}>
                <option value="Necklace">Necklace</option><option value="Ring">Ring</option>
                <option value="Earring">Earring</option><option value="Bracelet">Bracelet</option>
                <option value="Pendant">Pendant</option><option value="Bangle">Bangle</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Weight (g)</label>
              <input required type="number" step="0.01" className="input-field" value={weight} onChange={e => setWeight(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Purity (Carats)</label>
              <select className="input-select" value={carats} onChange={e => setCarats(Number(e.target.value) as any)}>
                <option value="18">18K</option><option value="20">20K</option>
                <option value="22">22K</option><option value="24">24K</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Making Charge (%)</label>
              <input required type="number" step="0.1" className="input-field" value={makingCharge} onChange={e => setMakingCharge(e.target.value)} />
            </div>
            <div className="input-group" style={{ display: "flex", justifyContent: "center" }}>
              <label className="input-label">Limited Edition?</label>
              <input type="checkbox" checked={isLimited} onChange={e => setIsLimited(e.target.checked)} style={{ width: "20px", height: "20px" }} />
            </div>
            <div className="input-group" style={{ gridColumn: "1 / -1" }}>
              <label className="input-label">Description</label>
              <textarea required className="input-field" rows={3} value={desc} onChange={e => setDesc(e.target.value)} />
            </div>
            <div className="input-group" style={{ gridColumn: "1 / -1" }}>
              <label className="input-label">Image {editingId && "(Leave empty to keep current)"}</label>
              <input required={!editingId} type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
              {imagePreview && (
                <div className="image-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>
            <div style={{ gridColumn: "1 / -1", display: "flex", gap: "16px" }}>
              <button type="submit" disabled={submitting} className="btn btn-primary">
                {submitting ? "Saving..." : (editingId ? "Update Vault" : "Save to Vault")}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="btn btn-secondary">Cancel Edit</button>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* INVENTORY LIST */}
      <section className="mb-12">
        <div className="section-header">
          <h2 className="text-headline-md">Current Inventory ({ornaments.length})</h2>
          <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", color: "var(--color-outline)" }} />
              <input
                type="text" placeholder="Search inventory..."
                className="input-field" style={{ paddingLeft: "28px", paddingRight: "12px", fontSize: "13px", borderBottom: "1px solid var(--color-outline-var)", width: "200px" }}
                value={inventorySearch} onChange={(e) => { setInventorySearch(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <button className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: "12px" }} onClick={exportCSV}>
              <Download size={14} /> CSV
            </button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th><th>Name</th><th>Category</th><th>Weight</th><th>Stock</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrnaments.map(o => (
                <tr key={o.id}>
                  <td><Image src={o.imageUrl} alt={o.name} width={40} height={40} style={{ objectFit: "cover" }} /></td>
                  <td>{o.name}</td>
                  <td>{o.category}</td>
                  <td>{o.weightGrams}g</td>
                  <td>
                    <input type="checkbox" className="stock-toggle" checked={o.inStock} onChange={() => handleStockToggle(o)} title={o.inStock ? "In Stock" : "Out of Stock"} />
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => handleEdit(o)} className="btn btn-secondary" style={{ padding: "4px 8px" }} title="Edit"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(o.id)} className="btn btn-danger" style={{ padding: "4px 8px" }} title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {searchedOrnaments.length === 0 && (
                <tr><td colSpan={6} className="text-center text-muted">No items found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
            <span className="text-muted" style={{ fontSize: "13px" }}>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, searchedOrnaments.length)} of {searchedOrnaments.length}
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn btn-secondary" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</button>
              <button className="btn btn-secondary" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
