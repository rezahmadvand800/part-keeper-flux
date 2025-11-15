import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { toast } from "sonner";

interface Part {
  id: string;
  name: string;
  sku: string;
  location: string;
  quantity: number;
}

export default function TransactionForm() {
  const [parts, setParts] = useState<Part[]>([]);
  const [sku, setSku] = useState("");
  const [type, setType] = useState<"ورود" | "خروج">("خروج");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    const { data, error } = await supabase
      .from('parts')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching parts:', error);
    } else {
      setParts(data || []);
    }
  };

  const selectedPart = parts.find(p => p.sku.toLowerCase() === sku.toLowerCase());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPart) {
      toast.error("SKU وارد شده معتبر نیست");
      return;
    }

    if (quantity <= 0) {
      toast.error("مقدار باید بزرگتر از صفر باشد");
      return;
    }

    const newQuantity = type === 'ورود' 
      ? selectedPart.quantity + quantity 
      : selectedPart.quantity - quantity;

    if (newQuantity < 0) {
      toast.error(`موجودی کافی نیست. موجودی فعلی: ${selectedPart.quantity}`);
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("لطفاً ابتدا وارد شوید");
      setLoading(false);
      return;
    }

    // Update part quantity
    const { error: updateError } = await supabase
      .from('parts')
      .update({ quantity: newQuantity })
      .eq('id', selectedPart.id);

    if (updateError) {
      console.error('Error updating part:', updateError);
      toast.error("خطا در به‌روزرسانی موجودی");
      setLoading(false);
      return;
    }

    // Log transaction
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        part_sku: selectedPart.sku,
        type,
        quantity,
        date: new Date().toLocaleDateString('fa-IR'),
      });

    if (transactionError) {
      console.error('Error logging transaction:', transactionError);
      toast.error("خطا در ثبت تراکنش");
    } else {
      toast.success(`تراکنش ${type} برای ${selectedPart.name} با موفقیت ثبت شد`);
      setSku("");
      setQuantity(1);
      fetchParts(); // Refresh parts list
    }

    setLoading(false);
  };

  return (
    <Card className="p-6 border-accent/20 shadow-md">
      <h3 className="text-xl font-bold text-accent border-b border-border pb-2 mb-6">
        ثبت ورود یا خروج قطعه
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">نوع تراکنش</label>
            <Select value={type} onValueChange={(value: "ورود" | "خروج") => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="خروج">
                  <span className="flex items-center gap-2">
                    <ArrowUpCircle className="h-4 w-4 text-destructive" />
                    خروج (مصرف/استفاده)
                  </span>
                </SelectItem>
                <SelectItem value="ورود">
                  <span className="flex items-center gap-2">
                    <ArrowDownCircle className="h-4 w-4 text-success" />
                    ورود (خرید/تولید)
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">کد SKU</label>
            <Input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="RES-1K-1%"
              className="font-mono text-left"
              dir="ltr"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">مقدار</label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              min="1"
              className="text-right persian-numbers"
              required
            />
          </div>
        </div>

        <Card className={`p-4 border-r-4 ${selectedPart ? 'border-primary bg-primary/5' : 'border-muted bg-muted/10'}`}>
          {selectedPart ? (
            <div className="text-sm space-y-1">
              <p className="font-bold text-foreground">
                قطعه: <span className="text-primary">{selectedPart.name}</span>
              </p>
              <p className="text-muted-foreground">
                مکان: {selectedPart.location} | موجودی فعلی:{" "}
                <span className={`font-semibold persian-numbers ${selectedPart.quantity < 50 ? 'text-destructive' : 'text-success'}`}>
                  {selectedPart.quantity.toLocaleString('fa-IR')}
                </span>{" "}
                عدد
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              پس از وارد کردن SKU، اطلاعات قطعه نمایش داده می‌شود
            </p>
          )}
        </Card>

        <Button
          type="submit"
          disabled={loading || !selectedPart}
          className={`w-full ${type === 'ورود' ? 'bg-gradient-success' : 'bg-gradient-primary'} hover:opacity-90 transition-smooth shadow-md`}
        >
          {loading ? "در حال ثبت..." : `ثبت تراکنش ${type}`}
        </Button>
      </form>
    </Card>
  );
}
