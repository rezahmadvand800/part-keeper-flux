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
            className={`relative p-4 transition-all duration-300 hover:shadow-lg cursor-move ${
              isDragging ? 'shadow-2xl rotate-2 scale-105' : ''
            }`}
            style={{
              borderLeftColor: item.color,
              borderLeftWidth: '4px',
            }}
            onDoubleClick={() => onEdit(item)}
          >
            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="absolute top-2 left-2 p-1.5 rounded-full bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground transition-colors z-10"
              aria-label="حذف آیتم"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Edit Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="absolute top-2 left-10 p-1.5 rounded-full bg-warning/10 hover:bg-warning hover:text-warning-foreground transition-colors z-10"
              aria-label="ویرایش آیتم"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            <div className="space-y-2 mt-6">
              <h3 className="font-bold text-lg text-foreground truncate" title={item.title}>
                {item.title}
              </h3>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">تعداد:</span>
                <span className="font-semibold text-foreground">{item.quantity.toLocaleString('fa-IR')}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">قیمت واحد:</span>
                <span className="font-semibold text-primary">{currencyFormatter.format(item.price)}</span>
              </div>

              <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                <span className="text-muted-foreground font-semibold">جمع:</span>
                <span className="font-bold text-lg text-success">{currencyFormatter.format(totalPrice)}</span>
              </div>

              {item.short_info && (
                <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
                  {item.short_info}
                </p>
              )}

              <div className="flex items-center justify-between mt-2">
                <span className="text-xs px-2 py-1 rounded-full bg-accent text-accent-foreground">
                  {item.group_name}
                </span>
                {item.suppliers.length > 0 && (
                  <span className="text-xs text-muted-foreground">
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
