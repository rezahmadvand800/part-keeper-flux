import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { Part, PartSchema } from "@/lib/validation";

interface AddPartFormProps {
  onSuccess: () => void;
  saveParts: (newParts: Part[]) => void;
  parts: Part[];
}

export default function AddPartForm({ onSuccess, saveParts, parts }: AddPartFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "مقاومت",
    footprint: "",
    location: "",
    quantity: 0,
    mpn: "",
    datasheet_url: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sku = formData.sku.toUpperCase().trim();
      
      // Check for duplicate SKU
      if (parts.some(p => p.sku === sku)) {
        toast.error(`قطعه با SKU: ${formData.sku} قبلاً ثبت شده است`);
        setLoading(false);
        return;
      }

      const newPart = {
        id: crypto.randomUUID(),
        name: formData.name.trim(),
        sku,
        category: formData.category,
        footprint: formData.footprint.trim(),
        location: formData.location.trim(),
        quantity: formData.quantity,
        mpn: formData.mpn.trim(),
        datasheet_url: formData.datasheet_url.trim(),
      };

      // Validate with zod
      const validated = PartSchema.parse(newPart);

      saveParts([...parts, validated]);
      toast.success(`قطعه ${formData.name} با موفقیت افزوده شد`);
      setFormData({
        name: "",
        sku: "",
        category: "مقاومت",
        footprint: "",
        location: "",
        quantity: 0,
        mpn: "",
        datasheet_url: "",
      });
      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`خطا: ${error.message}`);
      } else {
        toast.error("خطا در ثبت قطعه");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 border-primary/20 shadow-md">
      <h3 className="text-xl font-bold mb-4 text-primary flex items-center">
        <PlusCircle className="ml-2 h-6 w-6" />
        افزودن تکی قطعه جدید
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">نام قطعه *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="مقاومت 1k"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">کد SKU *</label>
            <Input
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
              placeholder="RES-1K-1%"
              className="font-mono text-left"
              dir="ltr"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">دسته</label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="مقاومت">مقاومت</SelectItem>
                <SelectItem value="خازن">خازن</SelectItem>
                <SelectItem value="آی‌سی">آی‌سی</SelectItem>
                <SelectItem value="ترانزیستور">ترانزیستور</SelectItem>
                <SelectItem value="سایر">سایر</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">پکیج/فوت‌پرینت</label>
            <Input
              value={formData.footprint}
              onChange={(e) => setFormData({ ...formData, footprint: e.target.value })}
              placeholder="SMD 0805"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">مکان انبار *</label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Rack A1-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">موجودی اولیه</label>
            <Input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              min="0"
              className="text-right persian-numbers"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">MPN (شماره سازنده)</label>
            <Input
              value={formData.mpn}
              onChange={(e) => setFormData({ ...formData, mpn: e.target.value })}
              placeholder="ATmega328P"
              className="font-mono text-left"
              dir="ltr"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">لینک دیتاشیت (URL)</label>
            <Input
              value={formData.datasheet_url}
              onChange={(e) => setFormData({ ...formData, datasheet_url: e.target.value })}
              placeholder="https://example.com/datasheet.pdf"
              className="text-left"
              dir="ltr"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-primary hover:opacity-90 shadow-primary transition-smooth"
        >
          {loading ? "در حال ثبت..." : "ثبت قطعه در انبار"}
        </Button>
      </form>
    </Card>
  );
}
