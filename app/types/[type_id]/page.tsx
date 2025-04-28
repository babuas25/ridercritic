import { notFound } from 'next/navigation';

interface Type {
  id: number;
  name: string;
  description?: string | null;
}

export default async function TypeDetailsPage({ params }: { params: { type_id: string } }) {
  let type: Type | null = null;
  let error = null;
  try {
    const res = await fetch(`https://babuas25-ridercritic-api.onrender.com/api/types/${params.type_id}`);
    if (!res.ok) throw new Error('Type not found');
    type = await res.json();
  } catch (e: any) {
    error = e.message || 'Error fetching type';
  }

  if (error || !type) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-2">{type.name}</h1>
      <p className="text-muted-foreground text-center mb-4">{type.description || "No description available."}</p>
    </div>
  );
} 