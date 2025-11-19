import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

interface EditPartModalProps {
  part: Part;
  onClose: () => void;
  onSuccess: () => void;
  saveParts: (newParts: Part[]) => void;
  allParts: Part[];
}

export default function EditPartModal({ part, onClose, onSuccess, saveParts, allParts }: EditPartModalProps) {
  const [formData, setFormData] = useState({
    name: part.name,
    category: part.category,
    footprint: part.footprint,
    location: part.location,
    mpn: part.mpn || '',
    datasheet_url: part.datasheet_url || '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.location) {
      toast.error("لطفاً نام و مکان را پر کنید");
      return;
    }

    setLoading(true);

    const updatedParts = allParts.map(p =>
      p.id === part.id
        ? {
            ...p,
            name: formData.name,
            category: formData.category,
            footprint: formData.footprint,
            location: formData.location,
            mpn: formData.mpn.trim(),
            datasheet_url: formData.datasheet_url.trim(),
          }
        : p
    );

    saveParts(updatedParts);
    toast.success(`قطعه ${formData.name} با موفقیت ویرایش شد`);
    onSuccess();
    onClose();
    setLoading(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            ویرایش قطعه: {part.sku}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">نام قطعه *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">دسته</label>
            <Input
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">پکیج/فوت‌پرینت</label>
            <Input
              value={formData.footprint}
              onChange={(e) => setFormData({ ...formData, footprint: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">مکان انبار *</label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">MPN</label>
            <Input
              value={formData.mpn}
              onChange={(e) => setFormData({ ...formData, mpn: e.target.value })}
              className="font-mono text-left"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">لینک دیتاشیت</label>
            <Input
              value={formData.datasheet_url}
              onChange={(e) => setFormData({ ...formData, datasheet_url: e.target.value })}
              className="text-left"
              dir="ltr"
            />
          </div>

          <p className="text-sm text-muted-foreground">
            موجودی ({part.quantity.toLocaleString('fa-IR')}) و SKU ({part.sku}) قابل ویرایش نیستند.
          </p>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" onClick={onClose} variant="outline">
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-primary shadow-primary hover:opacity-90 transition-smooth"
            >
              {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
