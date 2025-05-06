"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

function renderObject(obj: any, title?: string) {
  if (!obj || typeof obj !== "object") return null;
  return (
    <div className="mb-4">
      {title && <div className="font-semibold mt-2 mb-1 text-lg">{title}</div>}
      <ul className="ml-4 list-disc">
        {Object.entries(obj).map(([key, value]) => (
          <li key={key} className="mb-1">
            <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span> {typeof value === 'object' && value !== null ? renderObject(value) : String(value)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MotorcycleDetailsPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const auth = useAdminAuth();
  const isAdmin = auth?.isAdmin;
  const authLoading = auth?.loading;
  const [motorcycle, setMotorcycle] = useState<any>(null);
  const [brand, setBrand] = useState<any>(null);
  const [type, setType] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.replace("/admin");
    }
  }, [isAdmin, authLoading, router]);

  useEffect(() => {
    if (!id || !isAdmin || authLoading) return;
    setLoading(true);
    fetch(`https://api.ridercritic.com/api/motorcycles/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch motorcycle");
        return res.json();
      })
      .then((data) => {
        setMotorcycle(data);
        if (data.brand_id) {
          fetch(`https://api.ridercritic.com/api/brands/${data.brand_id}`)
            .then(res => res.ok ? res.json() : null)
            .then(setBrand);
        }
        if (data.type_id) {
          fetch(`https://api.ridercritic.com/api/types/${data.type_id}`)
            .then(res => res.ok ? res.json() : null)
            .then(setType);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load motorcycle");
        setLoading(false);
      });
  }, [id, isAdmin, authLoading]);

  if (authLoading || !isAdmin) return <div className="p-4">Loading...</div>;
  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!motorcycle) return <div className="p-4">No data found.</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">{motorcycle.name} Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {motorcycle.image_urls && motorcycle.image_urls.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2 justify-center">
              {motorcycle.image_urls.map((url: string, idx: number) => (
                <img key={idx} src={url} alt="Motorcycle" className="max-w-[180px] rounded shadow" />
              ))}
            </div>
          )}
          <div className="mb-2"><span className="font-semibold">Model Year:</span> {motorcycle.model_year}</div>
          <div className="mb-2"><span className="font-semibold">Description:</span> {motorcycle.description}</div>
          <div className="mb-2"><span className="font-semibold">Specifications:</span> {motorcycle.specifications}</div>
          <div className="mb-2 flex items-center gap-2">
            <span className="font-semibold">Brand:</span>
            {brand && brand.logo_url && <img src={brand.logo_url} alt={brand.name} className="h-6 w-6 object-contain inline-block" />}
            <span>{brand ? brand.name : `ID: ${motorcycle.brand_id}`}</span>
          </div>
          <div className="mb-2"><span className="font-semibold">Type:</span> {type ? type.name : `ID: ${motorcycle.type_id}`}</div>
          <div className="mb-2"><span className="font-semibold">Created At:</span> {motorcycle.created_at}</div>
        </div>
        <div>
          {renderObject(motorcycle.technical_spec, "Technical Specifications")}
          {renderObject(motorcycle.transmission, "Transmission")}
          {renderObject(motorcycle.chassis, "Chassis")}
          {renderObject(motorcycle.suspension, "Suspension")}
          {renderObject(motorcycle.brakes, "Brakes")}
          {renderObject(motorcycle.wheels_tyres, "Wheels & Tyres")}
          {renderObject(motorcycle.dimensions, "Dimensions")}
          {renderObject(motorcycle.weight, "Weight")}
          {renderObject(motorcycle.electrical, "Electrical")}
          {renderObject(motorcycle.performance, "Performance")}
          {renderObject(motorcycle.fuel_system, "Fuel System")}
          {renderObject(motorcycle.exhaust, "Exhaust")}
          {renderObject(motorcycle.features, "Features")}
          {renderObject(motorcycle.aesthetics, "Aesthetics")}
          {renderObject(motorcycle.manufacturer_details, "Manufacturer Details")}
          {renderObject(motorcycle.compliance_accessories, "Compliance Accessories")}
          {renderObject(motorcycle.additional_features, "Additional Features")}
        </div>
      </div>
    </div>
  );
} 