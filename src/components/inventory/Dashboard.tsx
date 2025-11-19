import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Package, TrendingUp, MapPin, Sparkles } from "lucide-react";

interface Part {
  id: string;
  name: string;
  quantity: number;
  location: string;
  sku: string;
  category: string;
}

export default function Dashboard() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = () => {
    const storedParts = localStorage.getItem('parts');
    if (storedParts) {
      setParts(JSON.parse(storedParts));
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
    <div className="space-y-8">
      {/* Professional Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-xl">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-foreground">
            داشبورد عملکرد انبار
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            نمای کلی از وضعیت موجودی و آمار انبار
          </p>
        </div>
      </div>
      
      {/* Professional Stats Cards with Enhanced Design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className={`group relative overflow-hidden p-8 hover:scale-105 hover:shadow-2xl transition-all duration-500 ${stat.shadowClass} border-2 border-transparent hover:border-primary/30 animate-scale-in cursor-pointer`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient Background Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
            
            {/* Content */}
            <div className="relative z-10 flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3 group-hover:text-primary transition-colors">
                  {stat.title}
                </p>
                <p className="text-5xl font-black text-foreground persian-numbers mb-2 group-hover:scale-110 transition-transform duration-300 origin-right">
                  {stat.value}
                </p>
              </div>
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                {stat.icon}
              </div>
            </div>
            
            {/* Decorative Corner */}
            <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          </Card>
        ))}
      </div>

      {/* Empty State with Professional Design */}
      {parts.length === 0 && (
        <Card className="relative overflow-hidden p-12 text-center border-2 border-dashed border-primary/20 bg-gradient-to-br from-card to-muted/20 hover:border-primary/40 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-primary opacity-[0.02]"></div>
          <div className="relative z-10">
            <div className="inline-flex p-6 bg-primary/10 rounded-3xl mb-6">
              <Package className="h-20 w-20 text-primary opacity-50" />
            </div>
            <h3 className="text-2xl font-black text-foreground mb-3">
              انبار خالی است
            </h3>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              از بخش <span className="font-bold text-primary">"فهرست قطعات"</span> شروع به افزودن قطعات کنید
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
