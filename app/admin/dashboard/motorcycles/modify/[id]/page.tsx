"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const NESTED_FIELDS = [
  "technical_spec",
  "transmission",
  "chassis",
  "suspension",
  "brakes",
  "wheels_tyres",
  "dimensions",
  "weight",
  "electrical",
  "performance",
  "fuel_system",
  "exhaust",
  "features",
  "aesthetics",
  "manufacturer_details",
  "compliance_accessories",
  "additional_features",
];

const getEmptyNested = () => ({
  additionalProp1: "",
  additionalProp2: "",
  additionalProp3: "",
});

// Define the type for nested fields
interface NestedField {
  additionalProp1: string;
  additionalProp2: string;
  additionalProp3: string;
}

interface MotorcycleForm {
  name: string;
  model_year: string;
  description: string;
  specifications: string;
  image_urls: string;
  brand_id: string;
  type_id: string;
  [key: string]: string | NestedField; // Allow nested fields
}

export default function EditMotorcyclePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [form, setForm] = useState<MotorcycleForm>({
    name: "",
    model_year: "",
    description: "",
    specifications: "",
    image_urls: "",
    brand_id: "",
    type_id: "",
    ...Object.fromEntries(NESTED_FIELDS.map((f) => [f, getEmptyNested()])),
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/motorcycles/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch motorcycle");
        return res.json();
      })
      .then((data) => {
        setForm({
          name: data.name || "",
          model_year: data.model_year?.toString() || "",
          description: data.description || "",
          specifications: data.specifications || "",
          image_urls: Array.isArray(data.image_urls) ? data.image_urls.join(", ") : "",
          brand_id: data.brand_id?.toString() || "",
          type_id: data.type_id?.toString() || "",
          ...Object.fromEntries(
            NESTED_FIELDS.map((f) => [f, data[f] || getEmptyNested()])
          ),
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load motorcycle");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNestedChange = (field: string, prop: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: {
        ...(prev[field] as NestedField),
        [prop]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
      const body = {
        name: form.name,
        model_year: form.model_year ? Number(form.model_year) : undefined,
        description: form.description,
        specifications: form.specifications,
        image_urls: form.image_urls ? form.image_urls.split(",").map((s) => s.trim()).filter(Boolean) : [],
        brand_id: form.brand_id ? Number(form.brand_id) : undefined,
        type_id: form.type_id ? Number(form.type_id) : undefined,
        ...Object.fromEntries(NESTED_FIELDS.map((f) => [f, form[f]])),
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/motorcycles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
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
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Motorcycle</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Model Year</label>
          <input name="model_year" type="number" value={form.model_year} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Specifications</label>
          <textarea name="specifications" value={form.specifications} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Image URLs (comma separated)</label>
          <input name="image_urls" value={form.image_urls} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Brand ID</label>
          <input name="brand_id" type="number" value={form.brand_id} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Type ID</label>
          <input name="type_id" type="number" value={form.type_id} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        {NESTED_FIELDS.map((field) => (
          <fieldset key={field} className="border rounded p-3">
            <legend className="font-semibold text-sm capitalize">{field.replace(/_/g, " ")}</legend>
            {Object.keys(getEmptyNested()).map((prop) => (
              <div key={prop} className="mb-2">
                <label className="block text-xs mb-1">{prop}</label>
                <input
                  type="text"
                  value={(form[field] as NestedField)[prop as keyof NestedField] || ""}
                  onChange={(e) => handleNestedChange(field, prop as keyof NestedField, e.target.value)}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
            ))}
          </fieldset>
        ))}
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition" disabled={saving}>
          {saving ? "Saving..." : "Update Motorcycle"}
        </button>
      </form>
    </div>
  );
} 