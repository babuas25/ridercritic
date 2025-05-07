"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Plus, Minus } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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
] as const;

type NestedField = typeof NESTED_FIELDS[number];
type NestedObject = { additionalProp1: string; additionalProp2: string; additionalProp3: string };

type MotorcycleForm = {
  name: string;
  model_year: string;
  description: string;
  specifications: string;
  image_urls: string[];
  brand_id: string;
  type_id: string;
} & { [K in NestedField]: NestedObject };

export default function AddMotorcyclePage() {
  const router = useRouter();
  const [form, setForm] = useState<MotorcycleForm>({
    name: "",
    model_year: "",
    description: "",
    specifications: "",
    image_urls: [""],
    brand_id: "",
    type_id: "",
    technical_spec: { additionalProp1: "", additionalProp2: "", additionalProp3: "" },
    transmission: { additionalProp1: "", additionalProp2: "", additionalProp3: "" },
    chassis: { additionalProp1: "", additionalProp2: "", additionalProp3: "" },
    suspension: { additionalProp1: "", additionalProp2: "", additionalProp3: "" },
    brakes: { additionalProp1: "", additionalProp2: "", additionalProp3: "" },
    wheels_tyres: { additionalProp1: "", additionalProp2: "", additionalProp3: "" },
    dimensions: { additionalProp1: "", additionalProp2: "", additionalProp3: "" },
    weight: { additionalProp1: "", additionalProp2: "", additionalProp3: "" },
    electrical: { additionalProp1: "", additionalProp2: "", additionalProp3: "" },
    performance: { additionalProp1: "", additionalProp2: "", additionalProp3: "" },
    fuel_system: { additionalProp1: "", additionalProp2: "", additionalProp3: "" },
    exhaust: { additionalProp1: "", additionalProp2: "", additionalProp3: "" },
    features: { additionalProp1: "", additionalProp2: "", additionalProp3: "" },
    aesthetics: { additionalProp1: "", additionalProp2: "", additionalProp3: "" },
    manufacturer_details: { additionalProp1: "", additionalProp2: "", additionalProp3: "" },
    compliance_accessories: { additionalProp1: "", additionalProp2: "", additionalProp3: "" },
    additional_features: { additionalProp1: "", additionalProp2: "", additionalProp3: "" },
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<string[]>([]);

  // Brand and Type state
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [brandsError, setBrandsError] = useState<string | null>(null);
  const [types, setTypes] = useState<{ id: number; name: string }[]>([]);
  const [typesLoading, setTypesLoading] = useState(true);
  const [typesError, setTypesError] = useState<string | null>(null);

  useEffect(() => {
    setBrandsLoading(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    fetch("https://api.ridercritic.com/api/brands?skip=0&limit=100", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        setBrands(data);
        setBrandsLoading(false);
      })
      .catch(() => {
        setBrandsError("Failed to load brands");
        setBrandsLoading(false);
      });
  }, []);

  useEffect(() => {
    setTypesLoading(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    fetch("https://api.ridercritic.com/api/types?skip=0&limit=100", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        setTypes(data);
        setTypesLoading(false);
      })
      .catch(() => {
        setTypesError("Failed to load types");
        setTypesLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUrlChange = (idx: number, value: string) => {
    const newUrls = [...form.image_urls];
    newUrls[idx] = value;
    setForm({ ...form, image_urls: newUrls });
  };

  const addImageUrl = () => {
    setForm({ ...form, image_urls: [...form.image_urls, ""] });
  };

  const removeImageUrl = (idx: number) => {
    const newUrls = form.image_urls.filter((_, i) => i !== idx);
    setForm({ ...form, image_urls: newUrls });
  };

  const handleNestedChange = (section: string, key: string, value: string) => {
    setForm({
      ...form,
      [section]: {
        ...((form as any)[section]),
        [key]: value,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("https://api.ridercritic.com/api/motorcycles/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          model_year: form.model_year ? Number(form.model_year) : undefined,
          brand_id: form.brand_id ? Number(form.brand_id) : undefined,
          type_id: form.type_id ? Number(form.type_id) : undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to create motorcycle");
      router.push("/admin/dashboard/motorcycles");
    } catch (err) {
      setError("Could not create motorcycle");
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add Motorcycle</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold">Name</label>
                <Input name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Model Year</label>
                <Input name="model_year" type="number" value={form.model_year} onChange={handleChange} required />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Brand</label>
                <Select
                  value={form.brand_id}
                  onValueChange={(value) => setForm({ ...form, brand_id: value })}
                  disabled={brandsLoading || !!brandsError}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder={brandsLoading ? "Loading..." : brandsError ? brandsError : "Select a brand"} />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id.toString()}>{brand.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Type</label>
                <Select
                  value={form.type_id}
                  onValueChange={(value) => setForm({ ...form, type_id: value })}
                  disabled={typesLoading || !!typesError}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder={typesLoading ? "Loading..." : typesError ? typesError : "Select a type"} />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 font-semibold">Description</label>
                <Textarea name="description" value={form.description} onChange={handleChange} required />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 font-semibold">Specifications</label>
                <Textarea name="specifications" value={form.specifications} onChange={handleChange} required />
              </div>
            </div>
            <Separator />
            <div>
              <label className="block mb-1 font-semibold">Image URLs</label>
              <div className="space-y-2">
                {form.image_urls.map((url, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input
                      value={url}
                      onChange={e => handleImageUrlChange(idx, e.target.value)}
                      placeholder="https://..."
                      required
                    />
                    {form.image_urls.length > 1 && (
                      <Button type="button" variant="destructive" size="icon" onClick={() => removeImageUrl(idx)}>
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addImageUrl} className="mt-2">
                  <Plus className="w-4 h-4 mr-1" /> Add Image URL
                </Button>
              </div>
            </div>
            <Separator />
            {NESTED_FIELDS.map(section => (
              <Collapsible key={section} open={openSections.includes(section)}>
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection(section)}>
                  <span className="font-semibold capitalize">{section.replace(/_/g, ' ')}</span>
                  <Button type="button" variant="ghost" size="icon">
                    {openSections.includes(section) ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </Button>
                </div>
                <CollapsibleContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    {Object.keys((form as any)[section]).map(key => (
                      <div key={key}>
                        <label className="block mb-1 text-xs font-medium">{key}</label>
                        <Input
                          value={(form as any)[section][key]}
                          onChange={e => handleNestedChange(section, key, e.target.value)}
                          placeholder={key}
                        />
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
                <Separator className="my-4" />
              </Collapsible>
            ))}
            {error && <div className="text-destructive text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Saving..." : "Add Motorcycle"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 