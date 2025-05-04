"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Brand {
  id: number;
  name: string;
  logo_url?: string;
  country?: string;
  founded_year?: number;
  authorization_status?: string;
  distributor?: string;
  created_at?: string;
  description?: string;
}

export default function EditBrandPage() {
  const router = useRouter();
  const params = useParams();
  const brandId = params?.id;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Brand>>({});

  useEffect(() => {
    if (!brandId) return;
    fetch(`https://api.ridercritic.com/api/brands/${brandId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch brand");
        return res.json();
      })
      .then((data) => {
        setBrand(data);
        setForm(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load brand");
        setLoading(false);
      });
  }, [brandId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const fullData = { ...brand, ...form };
      const res = await fetch(`https://api.ridercritic.com/api/brands/${brandId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullData),
      });
      if (!res.ok) throw new Error("Failed to update brand");
      router.push("/admin/dashboard/brands");
    } catch (err) {
      setError("Could not update brand");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!brand) return <div className="p-4">Brand not found.</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Brand</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input name="name" value={form.name || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Logo URL</label>
          <input name="logo_url" value={form.logo_url || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Country</label>
          <input name="country" value={form.country || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Founded Year</label>
          <input name="founded_year" type="number" value={form.founded_year || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Distributor</label>
          <input name="distributor" value={form.distributor || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Authorization Status</label>
          <input name="authorization_status" value={form.authorization_status || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea name="description" value={form.description || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
} 