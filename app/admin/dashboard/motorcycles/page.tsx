"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

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

  useEffect(() => {
    setLoading(true);
    setError(null);
    let url = `https://api.ridercritic.com/api/motorcycles/?skip=${(page - 1) * limit}&limit=${limit}`;
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
    setDeleting(true);
    setDeleteError(null);
    try {
      await Promise.all(
        selected.map(async (id) => {
          const res = await fetch(`https://api.ridercritic.com/api/motorcycles/${id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error();
        })
      );
      setMotorcycles((prev) => prev.filter((m) => !selected.includes(m.id)));
      setSelected([]);
    } catch {
      setDeleteError("Could not delete selected motorcycles");
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
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              disabled={deleting}
            >
              <Trash2 className="h-4 w-4" />
              {deleting ? "Deleting..." : `Delete Selected (${selected.length})`}
            </button>
          )}
          <Link href="/admin/dashboard/motorcycles/new">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition">
              <Plus className="h-4 w-4" /> Add New Motorcycle
            </button>
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
                      <button className="flex items-center gap-1 px-2 py-1 bg-primary text-white rounded hover:bg-primary/90 transition text-xs">
                        <Pencil className="h-3 w-3" /> Edit
                      </button>
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