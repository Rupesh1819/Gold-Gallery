"use client";
import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import { supabase } from "@/lib/supabase";
import { 
  getOrnaments, addOrnament, deleteOrnament, 
  getGoldRateSettings, updateGoldRateSettings, updateOrnament
} from "@/lib/database";
import { Ornament, GoldRateSettings } from "@/lib/types";
import { useGoldPrice } from "@/context/GoldPriceContext";
import { Trash2, Pencil, X } from "lucide-react";

export default function AdminDashboard() {
  
  // States
  const [ornaments, setOrnaments] = useState<Ornament[]>([]);
  const [settings, setSettings] = useState<GoldRateSettings>({ manual_rate: 6800, use_manual: false, last_updated: new Date(), updated_by: "" });
  const [loading, setLoading] = useState(true);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form states
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [carats, setCarats] = useState<18 | 20 | 22 | 24>(22);
  const [weight, setWeight] = useState("");
  const [category, setCategory] = useState<Ornament["category"]>("Necklace");
  const [makingCharge, setMakingCharge] = useState("12");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLimited, setIsLimited] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [orns, sets] = await Promise.all([getOrnaments(), getGoldRateSettings()]);
    setOrnaments(orns);
    if (sets) setSettings(sets);
    setLoading(false);
  };

  const handleSettingsUpdate = async () => {
    try {
      await updateGoldRateSettings(settings);
      await fetchData(); // Refresh local data to ensure consistency
      alert("Pricing settings updated!");
    } catch (err: any) {
      console.error(err);
      alert("Error updating settings: " + (err.message || JSON.stringify(err)));
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile && !editingId) return alert("Please select an image");
    setSubmitting(true);

    try {
      let imageUrl = editingId ? ornaments.find(o => o.id === editingId)?.imageUrl || "" : "";

      if (imageFile) {
        // 1. Compress Image
        const compressedFile = await imageCompression(imageFile, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true
        });

        // 2. Upload to Storage
        const fileName = `${Date.now()}_${compressedFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('ornaments')
          .upload(fileName, compressedFile);
          
        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage
          .from('ornaments')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrlData.publicUrl;
      }

      // 3. Save to Supabase
      const payload = {
        name,
        description: desc,
        carats,
        weightGrams: parseFloat(weight),
        category,
        imageUrl,
        inStock: true,
        isLimitedEdition: isLimited,
        makingChargePercent: parseFloat(makingCharge)
      };

      if (editingId) {
        await updateOrnament(editingId, payload);
      } else {
        await addOrnament(payload);
      }

      // 4. Reset Form
      setEditingId(null);
      setName(""); setDesc(""); setWeight(""); setImageFile(null);
      await fetchData();
      alert(`Ornament ${editingId ? "updated" : "added"} successfully!`);
    } catch (err) {
      console.error(err);
      alert(`Failed to ${editingId ? "update" : "add"} ornament.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (o: Ornament) => {
    setEditingId(o.id);
    setName(o.name);
    setCategory(o.category);
    setWeight(o.weightGrams.toString());
    setCarats(o.carats);
    setMakingCharge(o.makingChargePercent.toString());
    setIsLimited(o.isLimitedEdition);
    setDesc(o.description);
    setImageFile(null);
    window.scrollTo({ top: document.getElementById('inventory')?.offsetTop || 0, behavior: 'smooth' });
  };
  
  const cancelEdit = () => {
    setEditingId(null);
    setName(""); setDesc(""); setWeight(""); setImageFile(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    await deleteOrnament(id);
    await fetchData();
  };

  const totalPages = Math.ceil(ornaments.length / itemsPerPage);
  const currentOrnaments = ornaments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="container" style={{ paddingTop: "var(--space-8)" }}>
      
      {/* PRICING CONTROL */}
      <section id="pricing" className="mb-12">
        <h2 className="text-headline-md mb-6">Pricing Control</h2>
        <div className="stat-card" style={{ maxWidth: "600px" }}>
          <div className="input-group mb-6">
            <label className="input-label">Rate of the Day (INR/g)</label>
            <input 
              type="number" 
              className="input-field"
              value={settings.manual_rate}
              onChange={(e) => setSettings({...settings, manual_rate: parseFloat(e.target.value)})}
            />
          </div>

          <button className="btn btn-primary" onClick={handleSettingsUpdate}>
            Update Rate Settings
          </button>
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
                <option value="Necklace">Necklace</option>
                <option value="Ring">Ring</option>
                <option value="Earring">Earring</option>
                <option value="Bracelet">Bracelet</option>
                <option value="Pendant">Pendant</option>
                <option value="Bangle">Bangle</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Weight (g)</label>
              <input required type="number" step="0.01" className="input-field" value={weight} onChange={e => setWeight(e.target.value)} />
            </div>

            <div className="input-group">
              <label className="input-label">Purity (Carats)</label>
              <select className="input-select" value={carats} onChange={e => setCarats(Number(e.target.value) as any)}>
                <option value="18">18K</option>
                <option value="20">20K</option>
                <option value="22">22K</option>
                <option value="24">24K</option>
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
            </div>

            <div style={{ gridColumn: "1 / -1", display: "flex", gap: "16px" }}>
              <button type="submit" disabled={submitting} className="btn btn-primary">
                {submitting ? "Saving..." : (editingId ? "Update Vault" : "Save to Vault")}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="btn btn-secondary">
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* INVENTORY LIST */}
      <section className="mb-12">
        <h2 className="text-headline-md mb-6">Current Inventory ({ornaments.length})</h2>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Weight</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrnaments.map(o => (
                <tr key={o.id}>
                  <td>
                    <img src={o.imageUrl} alt={o.name} style={{ width: "40px", height: "40px", objectFit: "cover" }} />
                  </td>
                  <td>{o.name}</td>
                  <td>{o.category}</td>
                  <td>{o.weightGrams}g</td>
                  <td>{o.inStock ? "In Stock" : "Out"}</td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => handleEdit(o)} className="btn btn-secondary" style={{ padding: "4px 8px" }} title="Edit">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(o.id)} className="btn btn-danger" style={{ padding: "4px 8px" }} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {ornaments.length === 0 && (
                <tr><td colSpan={6} className="text-center text-muted">No items found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
            <span className="text-muted text-sm">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, ornaments.length)} of {ornaments.length}
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
      
    </div>
  );
}
