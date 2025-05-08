"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface Type {
  id: number;
  name: string;
  description?: string | null;
}

export default function AdminAllTypesPage() {
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState<keyof Type | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    setLoading(true);
    setError(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    let url = `https://api.ridercritic.com/api/types/?skip=${(page - 1) * limit}&limit=${limit}`;
    fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch types");
        return res.json();
      })
      .then((data) => {
        setTypes(data);
        setTotalCount(data.total || data.length);
        setLoading(false);
      })
      .catch((err) => {
        setError("Could not load types");
        setLoading(false);
      });
  }, [page, limit]);

  // Client-side sorting fallback
  const sortedTypes = sortBy
    ? [...types].sort((a, b) => {
        const aValue = a[sortBy] ?? '';
        const bValue = b[sortBy] ?? '';
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      })
    : types;

  const handleSort = (column: keyof Type) => {
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
    if (selected.length === types.length) {
      setSelected([]);
    } else {
      setSelected(types.map((t) => t.id));
    }
  };

  const handleBulkDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
      await Promise.all(
        selected.map(async (id) => {
          const res = await fetch(`https://api.ridercritic.com/api/types/${id}`, {
            method: "DELETE",
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
          });
          if (!res.ok) throw new Error();
        })
      );
      setTypes((prev) => prev.filter((t) => !selected.includes(t.id)));
      setSelected([]);
    } catch {
      setDeleteError("Could not delete selected types");
    } finally {
      setDeleting(false);
    }
  };

  // Pagination controls
  const totalPages = totalCount ? Math.ceil(totalCount / limit) : page + (types.length === limit ? 1 : 0);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">All Types</h1>
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
          <Link href="/admin/dashboard/types/new">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition">
              <Plus className="h-4 w-4" /> Add New Type
            </button>
          </Link>
        </div>
      </div>
      {deleteError && <div className="text-red-500 mb-2">{deleteError}</div>}
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm hidden md:table">
            <thead>
              <tr>
                <th className="border px-2 py-2 text-left w-8">
                  <input
                    type="checkbox"
                    checked={selected.length === types.length && types.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="border px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('id')}>ID {sortBy === 'id' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="border px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('name')}>Name {sortBy === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="border px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('description')}>Description {sortBy === 'description' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTypes.map((type) => (
                <tr key={type.id}>
                  <td className="border px-2 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selected.includes(type.id)}
                      onChange={() => handleSelect(type.id)}
                    />
                  </td>
                  <td className="border px-4 py-2">{type.id}</td>
                  <td className="border px-4 py-2">
                    <Link href={`/admin/dashboard/types/details/${type.id}`} className="text-primary hover:underline">
                      {type.name}
                    </Link>
                  </td>
                  <td className="border px-4 py-2">{type.description || '-'}</td>
                  <td className="border px-4 py-2">
                    <Link href={`/admin/dashboard/types/modify/${type.id}`}>
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
        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <div>Page {page}</div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={types.length < limit}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
            <select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              className="border rounded px-2 py-1"
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>{n} / page</option>
              ))}
            </select>
          </div>
        </div>
        </>
      )}
    </div>
  );
} 