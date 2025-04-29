"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Brand {
  id: number;
  name: string;
  logo_url?: string;
  origin_country?: string;
  founded_year?: number;
  authorization_status?: string;
  distributor?: string;
  created_at?: string;
  description?: string;
}

function formatDate(dateString?: string) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export default function BrandDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const brandId = params?.id;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!brandId) return;
    fetch(`https://babuas25-ridercritic-api.onrender.com/api/brands/${brandId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch brand");
        return res.json();
      })
      .then((data) => {
        setBrand(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load brand");
        setLoading(false);
      });
  }, [brandId]);

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`https://babuas25-ridercritic-api.onrender.com/api/brands/${brandId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete brand");
      router.push("/admin/dashboard/brands");
    } catch (err) {
      setDeleteError("Could not delete brand");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!brand) return <div className="p-4">Brand not found.</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Brand Details</h1>
      <div className="border rounded p-4 flex flex-col gap-3">
        <div className="flex items-center gap-4">
          {brand.logo_url && <img src={brand.logo_url} alt={brand.name} className="h-16 w-16 object-contain" />}
          <div>
            <div className="text-lg font-semibold">{brand.name}</div>
            <div className="text-xs text-muted-foreground">ID: {brand.id}</div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">Created At: <span className="text-black">{formatDate(brand.created_at)}</span></div>
        <div className="text-xs text-muted-foreground">Origin Country: <span className="text-black">{brand.origin_country || '-'}</span></div>
        <div className="text-xs text-muted-foreground">Founded Year: <span className="text-black">{brand.founded_year || '-'}</span></div>
        <div className="text-xs text-muted-foreground">Distributor: <span className="text-black">{brand.distributor || '-'}</span></div>
        <div className="text-xs text-muted-foreground">Authorization Status: <span className="text-black">{brand.authorization_status || '-'}</span></div>
        <div className="text-xs text-muted-foreground">Description: <span className="text-black">{brand.description || '-'}</span></div>
      </div>
      <div className="mt-6 flex flex-col items-center">
        {deleteError && <div className="text-red-500 mb-2">{deleteError}</div>}
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
} 