"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Type {
  id: number;
  name: string;
  description?: string | null;
}

export default function TypeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const typeId = params?.id;
  const [type, setType] = useState<Type | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!typeId) return;
    fetch(`https://api.ridercritic.com/api/types/${typeId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch type");
        return res.json();
      })
      .then((data) => {
        setType(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load type");
        setLoading(false);
      });
  }, [typeId]);

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
      const res = await fetch(`https://api.ridercritic.com/api/types/${typeId}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
      });
      if (!res.ok) throw new Error("Failed to delete type");
      router.push("/admin/dashboard/types");
    } catch (err) {
      setDeleteError("Could not delete type");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!type) return <div className="p-4">Type not found.</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Type Details</h1>
      <div className="border rounded p-4 flex flex-col gap-3">
        <div className="text-lg font-semibold">{type.name}</div>
        <div className="text-xs text-muted-foreground">ID: <span className="text-black">{type.id}</span></div>
        <div className="text-xs text-muted-foreground">Description: <span className="text-black">{type.description || '-'}</span></div>
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