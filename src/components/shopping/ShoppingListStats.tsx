import { useMemo } from 'react';
import { ShoppingItem } from './ShoppingList';
import { Card } from '@/components/ui/card';
import { Package, DollarSign, Users, Layers } from 'lucide-react';

interface ShoppingListStatsProps {
  items: ShoppingItem[];
}

export function ShoppingListStats({ items }: ShoppingListStatsProps) {
  const stats = useMemo(() => {
    const totalItems = items.length;
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    
    const suppliersSet = new Set<string>();
    items.forEach(item => {
      item.suppliers.forEach(supplier => suppliersSet.add(supplier.name));
    });
    
    const supplierTotals: Record<string, number> = {};
    items.forEach(item => {
      item.suppliers.forEach(supplier => {
        if (!supplierTotals[supplier.name]) {
          supplierTotals[supplier.name] = 0;
        }
        supplierTotals[supplier.name] += item.quantity * supplier.price;
      });
    });

    const groupsCount = new Set(items.map(item => item.group_name)).size;

    return {
      totalItems,
      totalQuantity,
      totalValue,
      suppliersCount: suppliersSet.size,
      supplierTotals,
      groupsCount,
    };
  }, [items]);

  const currencyFormatter = new Intl.NumberFormat('fa-IR', {
    style: 'currency',
    currency: 'IRR',
    maximumFractionDigits: 0,
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
          <div className="relative p-6 border-r-4 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-2">تعداد آیتم‌ها</p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.totalItems.toLocaleString('fa-IR')}
                </p>
              </div>
              <div className="p-4 bg-primary/15 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Package className="w-7 h-7 text-primary" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-0">
          <div className="absolute inset-0 bg-gradient-to-br from-success/10 via-success/5 to-transparent" />
          <div className="relative p-6 border-r-4 border-success">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-2">مجموع تعداد</p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.totalQuantity.toLocaleString('fa-IR')}
                </p>
              </div>
              <div className="p-4 bg-success/15 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Layers className="w-7 h-7 text-success" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-0">
          <div className="absolute inset-0 bg-gradient-to-br from-warning/10 via-warning/5 to-transparent" />
          <div className="relative p-6 border-r-4 border-warning">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-2">مجموع هزینه</p>
                <p className="text-2xl font-bold text-foreground">
                  {currencyFormatter.format(stats.totalValue)}
                </p>
              </div>
              <div className="p-4 bg-warning/15 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <DollarSign className="w-7 h-7 text-warning" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-0">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent" />
          <div className="relative p-6 border-r-4 border-accent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-2">تامین‌کنندگان</p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.suppliersCount.toLocaleString('fa-IR')}
                </p>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent"></span>
                  {stats.groupsCount} گروه
                </p>
              </div>
              <div className="p-4 bg-accent/15 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Users className="w-7 h-7 text-accent" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Supplier Breakdown */}
      {Object.keys(stats.supplierTotals).length > 0 && (
        <Card className="p-6">
          <h3 className="font-bold text-foreground mb-4">تفکیک هزینه به تامین‌کنندگان</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.supplierTotals).map(([name, total]) => (
              <div key={name} className="flex justify-between items-center p-3 bg-accent/20 rounded-lg">
                <span className="font-medium text-foreground">{name}</span>
                <span className="font-bold text-primary">{currencyFormatter.format(total)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
