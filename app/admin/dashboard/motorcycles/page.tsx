"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";

interface Motorcycle {
  id: number;
  name: string;
  brand_id?: number;
  type_id?: number;
  year?: number;
  price?: number;
  created_at?: string;
}

function formatDate(dateString?: string) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export default function AdminAllMotorcyclesPage() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState<keyof Motorcycle | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [undoTimeout, setUndoTimeout] = useState<NodeJS.Timeout | null>(null);
  const [lastBulkDeleted, setLastBulkDeleted] = useState<Motorcycle[] | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    let url = `${process.env.NEXT_PUBLIC_BASE_URL}api/motorcycles/?skip=${(page - 1) * limit}&limit=${limit}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch motorcycles");
        return res.json();
      })
      .then((data) => {
        setMotorcycles(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Could not load motorcycles");
        setLoading(false);
      });
  }, [page, limit]);

  const sortedMotorcycles = sortBy
    ? [...motorcycles].sort((a, b) => {
        const aValue = a[sortBy] ?? '';
        const bValue = b[sortBy] ?? '';
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      })
    : motorcycles;

  const handleSort = (column: keyof Motorcycle) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selected.length === motorcycles.length) {
      setSelected([]);
    } else {
      setSelected(motorcycles.map((m) => m.id));
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm("Are you sure you want to delete the selected motorcycles? This action cannot be undone.")) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
      // Store deleted motorcycles for undo
      const deletedMotorcycles = motorcycles.filter((m) => selected.includes(m.id));
      setLastBulkDeleted(deletedMotorcycles);
      await Promise.all(
        selected.map(async (id) => {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/motorcycles/${id}`, {
            method: "DELETE",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (!res.ok) throw new Error();
        })
      );
      setMotorcycles((prev) => prev.filter((m) => !selected.includes(m.id)));
      setSelected([]);
      // Show undo toast
      const undo = async () => {
        if (!lastBulkDeleted) return;
        await Promise.all(
          lastBulkDeleted.map(async (m) => {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/motorcycles/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify(m),
            });
          })
        );
        toast({ title: "Motorcycles restored", description: "The deleted motorcycles have been restored.", variant: "default" });
        setMotorcycles((prev) => [...prev, ...(lastBulkDeleted || [])]);
      };
      toast({
        title: "Selected motorcycles deleted successfully",
        description: "The selected motorcycles have been deleted.",
        variant: "default",
        action: (
          <button onClick={undo} className="ml-2 underline text-primary">Undo</button>
        ),
      });
      // Remove undo after 8 seconds
      if (undoTimeout) clearTimeout(undoTimeout);
      setUndoTimeout(setTimeout(() => setLastBulkDeleted(null), 8000));
    } catch {
      setDeleteError("Could not delete selected motorcycles");
      toast({ title: "Could not delete selected motorcycles", description: "An error occurred while deleting the selected motorcycles.", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = totalCount ? Math.ceil(totalCount / limit) : page + (motorcycles.length === limit ? 1 : 0);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">All Motorcycles</h1>
        <div className="flex gap-2">
          {selected.length > 0 && (
            <Button
              onClick={handleBulkDelete}
              variant="destructive"
              className="flex items-center gap-2"
              disabled={deleting}
            >
              <Trash2 className="h-4 w-4" />
              {deleting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin align-middle mr-1"></span>
                  Deleting...
                </>
              ) : `Delete Selected (${selected.length})`}
            </Button>
          )}
          <Link href="/admin/dashboard/motorcycles/new">
            <Button variant="default" className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add New Motorcycle
            </Button>
          </Link>
        </div>
      </div>
      {deleteError && <div className="text-red-500 mb-2">{deleteError}</div>}
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm hidden md:table">
            <thead>
              <tr>
                <th className="border px-2 py-2 text-left w-8">
                  <input
                    type="checkbox"
                    checked={selected.length === motorcycles.length && motorcycles.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="border px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('created_at')}>Created At {sortBy === 'created_at' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="border px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('id')}>ID {sortBy === 'id' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="border px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('name')}>Name {sortBy === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="border px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('brand_id')}>Brand ID {sortBy === 'brand_id' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="border px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('type_id')}>Type ID {sortBy === 'type_id' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="border px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('year')}>Year {sortBy === 'year' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="border px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('price')}>Price {sortBy === 'price' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedMotorcycles.map((motorcycle) => (
                <tr key={motorcycle.id}>
                  <td className="border px-2 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selected.includes(motorcycle.id)}
                      onChange={() => handleSelect(motorcycle.id)}
                    />
                  </td>
                  <td className="border px-4 py-2">{formatDate(motorcycle.created_at)}</td>
                  <td className="border px-4 py-2">{motorcycle.id}</td>
                  <td className="border px-4 py-2">
                    <Link href={`/admin/dashboard/motorcycles/details/${motorcycle.id}`} className="text-primary hover:underline">
                      {motorcycle.name}
                    </Link>
                  </td>
                  <td className="border px-4 py-2">{motorcycle.brand_id || '-'}</td>
                  <td className="border px-4 py-2">{motorcycle.type_id || '-'}</td>
                  <td className="border px-4 py-2">{motorcycle.year || '-'}</td>
                  <td className="border px-4 py-2">{motorcycle.price || '-'}</td>
                  <td className="border px-4 py-2">
                    <Link href={`/admin/dashboard/motorcycles/modify/${motorcycle.id}`}>
                      <Button variant="secondary" size="sm" className="flex items-center gap-1">
                        <Pencil className="h-3 w-3" /> Edit
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}