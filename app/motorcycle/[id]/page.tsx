"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function renderObject(obj: any, title?: string) {
  if (!obj || typeof obj !== "object") return null;
  return (
    <Card className="mb-4">
      {title && (
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-2">
          {Object.entries(obj).map(([key, value]) => (
            <div key={key} className="flex items-start gap-2">
              <Badge variant="outline" className="whitespace-nowrap">
                {key.replace(/_/g, ' ')}
              </Badge>
              <span className="text-muted-foreground">
                {typeof value === 'object' && value !== null ? renderObject(value) : String(value)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function PublicMotorcycleDetailsPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [motorcycle, setMotorcycle] = useState<any>(null);
  const [brand, setBrand] = useState<any>(null);
  const [type, setType] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImageIdx, setMainImageIdx] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/motorcycles/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch motorcycle");
        return res.json();
      })
      .then((data) => {
        setMotorcycle(data);
        if (data.brand_id) {
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/brands/${data.brand_id}`)
            .then(res => res.ok ? res.json() : null)
            .then(setBrand);
        }
        if (data.type_id) {
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/types/${data.type_id}`)
            .then(res => res.ok ? res.json() : null)
            .then(setType);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Could not load motorcycle");
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="p-4 space-y-4">
      <Skeleton className="h-8 w-[200px]" />
      <Skeleton className="h-[400px] w-full" />
    </div>
  );
  if (error) return (
    <Alert variant="destructive" className="m-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
  if (!motorcycle) return (
    <Alert className="m-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>No data found.</AlertDescription>
    </Alert>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Button
        variant="ghost"
        className="gap-2 mb-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-center">{motorcycle.name}</CardTitle>
          <CardDescription className="text-center">
            {motorcycle.model_year} • {type?.name || 'Unknown Type'} • {brand?.name || 'Unknown Brand'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {motorcycle.image_urls && motorcycle.image_urls.length > 0 && (
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    <img
                      src={motorcycle.image_urls[mainImageIdx]}
                      alt="Motorcycle"
                      className="w-80 h-80 object-cover rounded-2xl shadow-xl border bg-card border-border transition-transform duration-300 hover:scale-105 cursor-pointer"
                      onClick={() => window.open(motorcycle.image_urls[mainImageIdx], '_blank')}
                    />
                    {motorcycle.image_urls.length > 1 && (
                      <>
                        <button
                          className="absolute left-0 top-1/2 -translate-y-1/2 bg-card/80 border border-border rounded-full p-1 shadow hover:ring-2 hover:ring-primary focus:ring-2 focus:ring-primary transition"
                          onClick={() => setMainImageIdx((mainImageIdx - 1 + motorcycle.image_urls.length) % motorcycle.image_urls.length)}
                          style={{ zIndex: 2 }}
                          aria-label="Previous image"
                        >
                          <span className="text-primary text-lg">&#8592;</span>
                        </button>
                        <button
                          className="absolute right-0 top-1/2 -translate-y-1/2 bg-card/80 border border-border rounded-full p-1 shadow hover:ring-2 hover:ring-primary focus:ring-2 focus:ring-primary transition"
                          onClick={() => setMainImageIdx((mainImageIdx + 1) % motorcycle.image_urls.length)}
                          style={{ zIndex: 2 }}
                          aria-label="Next image"
                        >
                          <span className="text-primary text-lg">&#8594;</span>
                        </button>
                      </>
                    )}
                  </div>
                  {motorcycle.image_urls.length > 1 && (
                    <div className="flex gap-2 mt-3">
                      {motorcycle.image_urls.map((url: string, idx: number) => (
                        <img
                          key={idx}
                          src={url}
                          alt="Thumbnail"
                          className={`w-16 h-16 object-cover rounded-lg border-2 cursor-pointer transition-all bg-card border-border ${mainImageIdx === idx ? 'ring-2 ring-primary scale-105' : ''}`}
                          onClick={() => setMainImageIdx(idx)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Model Year</Badge>
                    <span>{motorcycle.model_year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Brand</Badge>
                    <div className="flex items-center gap-2">
                      {brand?.logo_url && (
                        <img src={brand.logo_url} alt={brand.name} className="h-6 w-6 object-contain" />
                      )}
                      <span>{brand ? brand.name : `ID: ${motorcycle.brand_id}`}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Type</Badge>
                    <span>{type ? type.name : `ID: ${motorcycle.type_id}`}</span>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary">Description</Badge>
                    <p className="text-muted-foreground">{motorcycle.description}</p>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary">Specifications</Badge>
                    <p className="text-muted-foreground">{motorcycle.specifications}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4">
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
        </CardContent>
      </Card>
    </div>
  );
}
