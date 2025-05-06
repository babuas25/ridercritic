"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditMotorcyclePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [form, setForm] = useState({
    name: "",
    brand_id: "",
    type_id: "",
    year: "",
    price: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`https://api.ridercritic.com/api/motorcycles/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch motorcycle");
        return res.json();
      })
      .then((data) => {
        setForm({
          name: data.name || "",
          brand_id: data.brand_id?.toString() || "",
          type_id: data.type_id?.toString() || "",
          year: data.year?.toString() || "",
          price: data.price?.toString() || "",
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load motorcycle");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`https://api.ridercritic.com/api/motorcycles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          brand_id: form.brand_id ? Number(form.brand_id) : undefined,
          type_id: form.type_id ? Number(form.type_id) : undefined,
          year: form.year ? Number(form.year) : undefined,
          price: form.price ? Number(form.price) : undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to update motorcycle");
      router.push("/admin/dashboard/motorcycles");
    } catch (err) {
      setError("Could not update motorcycle");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Motorcycle</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Brand ID</label>
          <input name="brand_id" type="number" value={form.brand_id} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Type ID</label>
          <input name="type_id" type="number" value={form.type_id} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Year</label>
          <input name="year" type="number" value={form.year} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Price</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition" disabled={saving}>
          {saving ? "Saving..." : "Update Motorcycle"}
        </button>
      </form>
    </div>
  );
} 