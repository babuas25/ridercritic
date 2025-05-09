"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditTypePage() {
  const router = useRouter();
  const params = useParams();
  const typeId = params?.id;
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!typeId) return;
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/types/${typeId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch type");
        return res.json();
      })
      .then((data) => {
        setForm({
          name: data.name || "",
          description: data.description || "",
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load type");
        setLoading(false);
      });
  }, [typeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/types/${typeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
        }),
      });
      if (!res.ok) throw new Error("Failed to update type");
      router.push("/admin/dashboard/types");
    } catch (err) {
      setError("Could not update type");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Type</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
} 