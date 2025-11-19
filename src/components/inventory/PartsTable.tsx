import { Button } from "@/components/ui/button";
import { ExternalLink, Edit, Trash2, Package, MapPin } from "lucide-react";
import { toast } from "sonner";

interface Part {
  id: string;
  name: string;
  sku: string;
  category: string;
  footprint: string;
  location: string;
  quantity: number;
  mpn: string;
  datasheet_url: string;
}

interface PartsTableProps {
  parts: Part[];
  onEdit: (part: Part) => void;
  searchTerm: string;
  saveParts: (newParts: Part[]) => void;
  allParts: Part[];
}

export default function PartsTable({ parts, onEdit, searchTerm, saveParts, allParts }: PartsTableProps) {
  const handleDelete = (part: Part) => {
    if (!window.confirm(`آیا از حذف قطعه "${part.name}" اطمینان دارید؟`)) {
      return;
    }

    const updatedParts = allParts.filter(p => p.id !== part.id);
    saveParts(updatedParts);
    toast.success(`قطعه ${part.name} با موفقیت حذف شد`);
  };

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-primary/10 shadow-2xl bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead className="bg-gradient-primary text-primary-foreground">
            <tr>
              <th className="p-5 text-sm font-black uppercase tracking-wide">نام قطعه</th>
              <th className="p-5 text-sm font-black uppercase tracking-wide">SKU</th>
              <th className="p-5 text-sm font-black uppercase tracking-wide">MPN</th>
              <th className="p-5 text-sm font-black uppercase tracking-wide">دسته</th>
              <th className="p-5 text-sm font-black uppercase tracking-wide">مکان</th>
              <th className="p-5 text-sm font-black uppercase tracking-wide text-center">موجودی</th>
              <th className="p-5 text-sm font-black uppercase tracking-wide text-center">دیتاشیت</th>
              <th className="p-5 text-sm font-black uppercase tracking-wide text-center">عملیات</th>
            </tr>
          </thead>
        <tbody>
          {parts.length === 0 ? (
            <tr>
              <td colSpan={8} className="p-8 text-center text-muted-foreground bg-card">
                {searchTerm
                  ? `موردی با عنوان "${searchTerm}" یافت نشد.`
                  : "هیچ قطعه‌ای در موجودی ثبت نشده است."}
              </td>
            </tr>
          ) : (
            parts.map((part, index) => {
              const isLowStock = part.quantity < 50;
              const rowClass = index % 2 === 0 ? 'bg-card' : 'bg-muted/30';
              
              return (
                <tr
                  key={part.id}
                  className={`${rowClass} border-b border-border hover:bg-muted/50 transition-smooth animate-fade-in`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="p-4 font-medium text-foreground">{part.name}</td>
                  <td className="p-4 font-mono text-left text-primary" dir="ltr">
                    {part.sku}
                  </td>
                  <td className="p-4 font-mono text-left text-muted-foreground" dir="ltr">
                    {part.mpn || 'N/A'}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{part.category}</td>
                  <td className="p-4 text-sm font-semibold text-foreground">{part.location}</td>
                  <td
                    className={`p-4 font-bold text-center persian-numbers ${
                      isLowStock ? 'text-destructive bg-destructive-light rounded-md' : 'text-success'
                    }`}
                  >
                    {part.quantity.toLocaleString('fa-IR')}
                  </td>
                  <td className="p-4 text-center">
                    {part.datasheet_url ? (
                      <a
                        href={part.datasheet_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center text-primary hover:text-primary-glow transition-smooth"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">ندارد</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <Button
                        onClick={() => onEdit(part)}
                        variant="outline"
                        size="sm"
                        className="hover:bg-warning hover:text-warning-foreground transition-smooth"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(part)}
                        variant="outline"
                        size="sm"
                        className="hover:bg-destructive hover:text-destructive-foreground transition-smooth"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  </div>
);
}
