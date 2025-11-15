import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

interface AddPartFormProps {
  onSuccess: () => void;
}

export default function AddPartForm({ onSuccess }: AddPartFormProps) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.sku || !formData.location) {
      toast.error("لطفاً فیلدهای نام، SKU و مکان را پر کنید");
      return;
    }

    if (formData.quantity < 0) {
      toast.error("موجودی اولیه نمی‌تواند منفی باشد");
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("لطفاً ابتدا وارد شوید");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('parts').insert({
      user_id: user.id,
      name: formData.name,
      sku: formData.sku.toUpperCase().trim(),
      category: formData.category,
      footprint: formData.footprint,
      location: formData.location,
      quantity: formData.quantity,
      mpn: formData.mpn.trim(),
      datasheet_url: formData.datasheet_url.trim(),
    });

    if (error) {
      if (error.message.includes('duplicate key')) {
        toast.error(`قطعه با SKU: ${formData.sku} قبلاً ثبت شده است`);
      } else {
        toast.error("خطا در افزودن قطعه");
        console.error('Error adding part:', error);
      }
    } else {
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
    }

    setLoading(false);
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
