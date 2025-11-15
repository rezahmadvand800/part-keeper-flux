import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Package, TrendingUp, MapPin } from "lucide-react";

interface Part {
  id: string;
  name: string;
  quantity: number;
  location: string;
}

export default function Dashboard() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParts();

    const channel = supabase
      .channel('parts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'parts'
        },
        () => fetchParts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchParts = async () => {
    const { data, error } = await supabase
      .from('parts')
      .select('*');

    if (error) {
      console.error('Error fetching parts:', error);
    } else {
      setParts(data || []);
    }
    setLoading(false);
  };

  const totalUniqueParts = parts.length;
  const totalQuantity = parts.reduce((sum, p) => sum + p.quantity, 0);
  const uniqueLocations = new Set(parts.map(p => p.location)).size;

  const stats = [
    {
      title: "کل قطعات منحصر به فرد",
      value: totalUniqueParts.toLocaleString('fa-IR'),
      icon: <Package className="h-8 w-8 text-primary" />,
      gradient: "bg-gradient-primary",
      shadowClass: "shadow-primary"
    },
    {
      title: "مجموع موجودی انبار",
      value: totalQuantity.toLocaleString('fa-IR'),
      icon: <TrendingUp className="h-8 w-8 text-success" />,
      gradient: "bg-gradient-success",
      shadowClass: "shadow-success"
    },
    {
      title: "مکان‌های انبار فعال",
      value: uniqueLocations.toLocaleString('fa-IR'),
      icon: <MapPin className="h-8 w-8 text-accent" />,
      gradient: "from-accent to-secondary",
      shadowClass: "shadow-md"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">
        📊 داشبورد عملکرد انبار
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className={`p-6 hover:scale-105 transition-all duration-300 ${stat.shadowClass} border-l-4 ${stat.gradient.includes('gradient') ? '' : 'border-primary'} animate-scale-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-extrabold text-foreground persian-numbers">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.gradient} bg-opacity-10`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {parts.length === 0 && (
        <Card className="p-8 text-center border-dashed border-2 border-primary/20">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            انبار خالی است
          </h3>
          <p className="text-muted-foreground">
            از بخش "فهرست قطعات" شروع به افزودن قطعات کنید
          </p>
        </Card>
      )}
    </div>
  );
}
