import { ShoppingItem } from './ShoppingList';
import { Edit2, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ShoppingItemCardProps {
  item: ShoppingItem;
  onEdit: (item: ShoppingItem) => void;
  onDelete: (id: string) => void;
  isDragging: boolean;
}

export function ShoppingItemCard({ item, onEdit, onDelete, isDragging }: ShoppingItemCardProps) {
  const currencyFormatter = new Intl.NumberFormat('fa-IR', {
    style: 'currency',
    currency: 'IRR',
    maximumFractionDigits: 0,
  });

  const totalPrice = item.quantity * item.price;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className={`relative p-6 transition-all duration-500 hover:shadow-2xl cursor-move group border-0 overflow-hidden ${
              isDragging ? 'shadow-2xl rotate-2 scale-110 ring-4 ring-primary/30' : ''
            }`}
            style={{
              borderRightColor: item.color,
              borderRightWidth: '6px',
            }}
            onDoubleClick={() => onEdit(item)}
          >
            {/* Background Gradient */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
              style={{
                background: `linear-gradient(135deg, ${item.color}08 0%, transparent 100%)`
              }}
            />

            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="absolute top-3 left-3 p-2 rounded-xl bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 z-10 opacity-0 group-hover:opacity-100 hover:scale-110"
              aria-label="حذف آیتم"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Edit Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="absolute top-3 left-14 p-2 rounded-xl bg-warning/10 hover:bg-warning hover:text-warning-foreground transition-all duration-300 z-10 opacity-0 group-hover:opacity-100 hover:scale-110"
              aria-label="ویرایش آیتم"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <div className="relative space-y-3 mt-8">
              <h3 className="font-bold text-xl text-foreground truncate pr-2" title={item.title} style={{
                borderRight: `3px solid ${item.color}`
              }}>
                {item.title}
              </h3>
              
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <span className="text-sm text-muted-foreground font-medium">تعداد:</span>
                <span className="font-bold text-foreground text-lg">{item.quantity.toLocaleString('fa-IR')}</span>
              </div>

              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <span className="text-sm text-muted-foreground font-medium">قیمت واحد:</span>
                <span className="font-semibold text-primary text-base">{currencyFormatter.format(item.price)}</span>
              </div>

              <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-gradient-to-l from-success/10 to-transparent border-t-2 border-success/20 mt-3">
                <span className="text-sm text-muted-foreground font-bold">مجموع:</span>
                <span className="font-bold text-xl text-success">{currencyFormatter.format(totalPrice)}</span>
              </div>

              {item.short_info && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-3 p-3 rounded-lg bg-muted/20 italic">
                  {item.short_info}
                </p>
              )}

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                <span 
                  className="text-xs px-3 py-1.5 rounded-full font-medium transition-all hover:scale-105" 
                  style={{
                    backgroundColor: `${item.color}20`,
                    color: item.color
                  }}
                >
                  {item.group_name}
                </span>
                {item.suppliers.length > 0 && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1 bg-accent/10 px-2 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    {item.suppliers.length} تامین‌کننده
                  </span>
                )}
              </div>
            </div>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-sm p-4" dir="rtl">
          <div className="space-y-2">
            <h4 className="font-bold text-sm">{item.title}</h4>
            {item.full_info && (
              <p className="text-xs text-muted-foreground">{item.full_info}</p>
            )}
            {item.suppliers.length > 0 && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs font-semibold mb-1">تامین‌کنندگان:</p>
                {item.suppliers.map((supplier, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span>{supplier.name}:</span>
                    <span className="font-semibold">{currencyFormatter.format(supplier.price)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
