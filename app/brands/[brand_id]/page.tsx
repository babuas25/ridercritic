export const dynamic = "force-dynamic";
import { notFound } from 'next/navigation';

interface Brand {
  id: number;
  name: string;
  logo_url: string;
  country: string;
  description: string;
  founded_year: number;
  authorization_status: string;
  distributor: string;
  created_at: string;
}

export default async function BrandDetailsPage({ params }: { params: { brand_id: string } }) {
  let brand: Brand | null = null;
  let error = null;
  try {
    const res = await fetch(`https://api.ridercritic.com/api/brands/${params.brand_id}`);
    if (!res.ok) throw new Error('Brand not found');
    brand = await res.json();
  } catch (e: any) {
    error = e.message || 'Error fetching brand';
  }

  if (error || !brand) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <div className="flex flex-col items-center gap-4">
        {brand.logo_url && (
          <img src={brand.logo_url} alt={brand.name} className="h-24 mb-4" />
        )}
        <h1 className="text-3xl font-bold mb-2">{brand.name}</h1>
        <p className="text-muted-foreground text-center mb-4">{brand.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div><strong>Country:</strong> {brand.country}</div>
          <div><strong>Founded:</strong> {brand.founded_year}</div>
          <div><strong>Status:</strong> {brand.authorization_status}</div>
          <div><strong>Distributor:</strong> {brand.distributor}</div>
          <div className="md:col-span-2"><strong>Created at:</strong> {new Date(brand.created_at).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
} 