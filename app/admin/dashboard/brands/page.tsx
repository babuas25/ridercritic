"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

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

export default function AdminAllBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState<keyof Brand | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    setLoading(true);
    setError(null);
    let url = `https://babuas25-ridercritic-api.onrender.com/api/brands/?skip=${(page - 1) * limit}&limit=${limit}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch brands");
        return res.json();
      })
      .then((data) => {
        setBrands(data);
        // If API returns total count, set it here. Otherwise, setTotalCount(data.length)
        // setTotalCount(data.total || data.length);
        setLoading(false);
      })
      .catch((err) => {
        setError("Could not load brands");
        setLoading(false);
      });
  }, [page, limit]);

  // Client-side sorting fallback
  const sortedBrands = sortBy
    ? [...brands].sort((a, b) => {
        const aValue = a[sortBy] ?? '';
        const bValue = b[sortBy] ?? '';
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      })
    : brands;

  const handleSort = (column: keyof Brand) => {
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
    if (selected.length === brands.length) {
      setSelected([]);
    } else {
      setSelected(brands.map((b) => b.id));
    }
  };

  const handleBulkDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await Promise.all(
        selected.map(async (id) => {
          const res = await fetch(`https://babuas25-ridercritic-api.onrender.com/api/brands/${id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error();
        })
      );
      setBrands((prev) => prev.filter((b) => !selected.includes(b.id)));
      setSelected([]);
    } catch {
      setDeleteError("Could not delete selected brands");
    } finally {
      setDeleting(false);
    }
  };

  // Pagination controls
  const totalPages = totalCount ? Math.ceil(totalCount / limit) : page + (brands.length === limit ? 1 : 0);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">All Brands</h1>
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
          <Link href="/admin/dashboard/brands/new">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition">
              <Plus className="h-4 w-4" /> Add New Brand
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
                    checked={selected.length === brands.length && brands.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="border px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('created_at')}>Created At {sortBy === 'created_at' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="border px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('id')}>ID {sortBy === 'id' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="border px-4 py-2 text-left">Logo</th>
                <th className="border px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('name')}>Name {sortBy === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="border px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('origin_country')}>Origin Country {sortBy === 'origin_country' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="border px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('founded_year')}>Founded Year {sortBy === 'founded_year' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="border px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('distributor')}>Distributor {sortBy === 'distributor' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="border px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('authorization_status')}>Authorization Status {sortBy === 'authorization_status' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="border px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('description')}>Description {sortBy === 'description' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedBrands.map((brand) => (
                <tr key={brand.id}>
                  <td className="border px-2 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selected.includes(brand.id)}
                      onChange={() => handleSelect(brand.id)}
                    />
                  </td>
                  <td className="border px-4 py-2">{formatDate(brand.created_at)}</td>
                  <td className="border px-4 py-2">{brand.id}</td>
                  <td className="border px-4 py-2">
                    {brand.logo_url ? (
                      <img src={brand.logo_url} alt={brand.name} className="h-8 w-8 object-contain" />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    <Link href={`/admin/dashboard/brands/details/${brand.id}`} className="text-primary hover:underline">
                      {brand.name}
                    </Link>
                  </td>
                  <td className="border px-4 py-2">{brand.origin_country || '-'}</td>
                  <td className="border px-4 py-2">{brand.founded_year || '-'}</td>
                  <td className="border px-4 py-2">{brand.distributor || '-'}</td>
                  <td className="border px-4 py-2">{brand.authorization_status || '-'}</td>
                  <td className="border px-4 py-2">{brand.description || '-'}</td>
                  <td className="border px-4 py-2">
                    <Link href={`/admin/dashboard/brands/modify/${brand.id}`}>
                      <button className="flex items-center gap-1 px-2 py-1 bg-primary text-white rounded hover:bg-primary/90 transition text-xs">
                        <Pencil className="h-3 w-3" /> Edit
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Mobile view: vertical cards */}
          <div className="md:hidden space-y-4">
            {brands.map((brand) => (
              <div key={brand.id} className="border rounded p-3 flex flex-col gap-2">
                <div className="text-xs text-muted-foreground">Created At: <span className="text-black">{formatDate(brand.created_at)}</span></div>
                <div className="text-xs text-muted-foreground">ID: <span className="text-black">{brand.id}</span></div>
                <div className="text-xs text-muted-foreground">Logo: {brand.logo_url ? <img src={brand.logo_url} alt={brand.name} className="h-8 w-8 inline object-contain" /> : '-'}</div>
                <div className="text-xs text-muted-foreground">Name: <span className="text-black">
                  <Link href={`/admin/dashboard/brands/details/${brand.id}`} className="text-primary hover:underline">
                    {brand.name}
                  </Link>
                </span></div>
                <div className="text-xs text-muted-foreground">Origin Country: <span className="text-black">{brand.origin_country || '-'}</span></div>
                <div className="text-xs text-muted-foreground">Founded Year: <span className="text-black">{brand.founded_year || '-'}</span></div>
                <div className="text-xs text-muted-foreground">Distributor: <span className="text-black">{brand.distributor || '-'}</span></div>
                <div className="text-xs text-muted-foreground">Authorization Status: <span className="text-black">{brand.authorization_status || '-'}</span></div>
                <div className="text-xs text-muted-foreground">Description: <span className="text-black">{brand.description || '-'}</span></div>
                <div>
                  <Link href={`/admin/dashboard/brands/modify/${brand.id}`}>
                    <button className="flex items-center gap-1 px-2 py-1 bg-primary text-white rounded hover:bg-primary/90 transition text-xs">
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination controls */}
          <div className="flex justify-between items-center mt-4">
            <div>
              Page {page}
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </button>
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage((p) => p + 1)}
                disabled={brands.length < limit}
              >
                Next
              </button>
              <select value={limit} onChange={e => { setLimit(Number(e.target.value)); setPage(1); }} className="ml-2 border rounded px-2 py-1">
                {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n} / page</option>)}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 