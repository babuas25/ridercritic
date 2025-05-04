"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddBrandPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    logo_url: "",
    origin_country: "",
    description: "",
    founded_year: "",
    authorization_status: "",
    distributor: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("https://api.ridercritic.com/api/brands/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          logo_url: form.logo_url,
          origin_country: form.origin_country,
          description: form.description,
          founded_year: form.founded_year ? Number(form.founded_year) : undefined,
          authorization_status: form.authorization_status,
          distributor: form.distributor,
        }),
      });
      if (!res.ok) throw new Error("Failed to create brand");
      router.push("/admin/dashboard/brands");
    } catch (err) {
      setError("Could not create brand");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Brand</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Logo URL</label>
          <input name="logo_url" value={form.logo_url} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Origin Country</label>
          <input name="origin_country" value={form.origin_country} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Founded Year</label>
          <input name="founded_year" type="number" value={form.founded_year} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Distributor</label>
          <input name="distributor" value={form.distributor} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Authorization Status</label>
          <select
            name="authorization_status"
            value={form.authorization_status}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select status</option>
            <option value="Official">Official</option>
            <option value="Unofficial">Unofficial</option>
            <option value="Personal Import">Personal Import</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition" disabled={saving}>
          {saving ? "Saving..." : "Add Brand"}
        </button>
      </form>
    </div>
  );
} 