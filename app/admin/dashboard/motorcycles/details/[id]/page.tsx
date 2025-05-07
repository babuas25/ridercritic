"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    fetch(`https://api.ridercritic.com/api/motorcycles/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch motorcycle");
        return res.json();
      })
      .then((data) => {
        setMotorcycle(data);
        if (data.brand_id) {
          fetch(`https://api.ridercritic.com/api/brands/${data.brand_id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then(res => res.ok ? res.json() : null)
            .then(setBrand);
        }
        if (data.type_id) {
          fetch(`https://api.ridercritic.com/api/types/${data.type_id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then(res => res.ok ? res.json() : null)
            .then(setType);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Could not load motorcycle");
        setLoading(false);
      });
  }, [id, isAdmin, authLoading]);

  if (authLoading || !isAdmin) return <div className="p-4">Loading...</div>;
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
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

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
                  <div className="grid grid-cols-2 gap-4">
                    {motorcycle.image_urls.map((url: string, idx: number) => (
                      <img 
                        key={idx} 
                        src={url} 
                        alt="Motorcycle" 
                        className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer" 
                        onClick={() => window.open(url, '_blank')}
                      />
                    ))}
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
                    <Separator />
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
    </ScrollArea>
  );
} 