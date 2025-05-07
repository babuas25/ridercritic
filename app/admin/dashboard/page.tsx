'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Bike, 
  Package, 
  Users, 
  ShoppingBag,
  Star 
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalMotorcycles: number;
  totalProducts: number;
  totalReviews: number;
  totalOrders: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalMotorcycles: 0,
    totalProducts: 0,
    totalReviews: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    // Fetch stats from your API
    setStats({
      totalUsers: 150,
      totalMotorcycles: 75,
      totalProducts: 200,
      totalReviews: 450,
      totalOrders: 320,
    });
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const cards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users },
    { title: 'Motorcycles', value: stats.totalMotorcycles, icon: Bike },
    { title: 'Products', value: stats.totalProducts, icon: Package },
    { title: 'Reviews', value: stats.totalReviews, icon: Star },
    { title: 'Orders', value: stats.totalOrders, icon: ShoppingBag },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => router.push('/admin/dashboard/motorcycles/new')}>
          Add New Motorcycle
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}