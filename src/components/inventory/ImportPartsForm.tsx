import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Upload, CheckCircle } from "lucide-react";
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

interface ImportPartsFormProps {
  onSuccess: () => void;
  saveParts: (newParts: Part[]) => void;
  parts: Part[];
}

export default function ImportPartsForm({ onSuccess, saveParts, parts }: ImportPartsFormProps) {
  const [dataText, setDataText] = useState("");
  const [parsedCount, setParsedCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const parseAndImport = () => {
    if (!dataText.trim()) {
      toast.error("لطفاً داده‌ها را وارد کنید");
      return;
    }

    setLoading(true);

    // Detect delimiter
    const lines = dataText.trim().split('\n');
    const firstLine = lines[0];
    const tabCount = (firstLine.match(/\t/g) || []).length;
    const commaCount = (firstLine.match(/,/g) || []).length;
    const delimiter = tabCount > commaCount ? '\t' : ',';

    const partsToImport: Part[] = [];
    let errors = 0;
    let duplicates = 0;
    const existingSkus = new Set(parts.map(p => p.sku));

    lines.forEach((line, index) => {
      const columns = line.trim().split(delimiter).map(col => col.trim());
      
      if (columns.length < 8) {
        if (index === 0) return; // Skip header
        errors++;
        return;
      }

      const [name, sku, category, footprint, location, quantityStr, mpn, datasheetUrl] = columns;
      const quantity = parseInt(quantityStr);

      if (!name || !sku || !location || isNaN(quantity) || quantity < 0) {
        errors++;
        return;
      }

      const skuUpper = sku.toUpperCase().trim();
      
      // Check for duplicate SKU
      if (existingSkus.has(skuUpper)) {
        duplicates++;
        return;
      }

      partsToImport.push({
        id: crypto.randomUUID(),
        name,
        sku: skuUpper,
        category: category || 'سایر',
        footprint: footprint || '',
        location,
        quantity,
        mpn: mpn || '',
        datasheet_url: datasheetUrl || '',
      });
      
      existingSkus.add(skuUpper);
    });

    if (partsToImport.length === 0) {
      toast.error("هیچ داده معتبری برای ورود یافت نشد");
      setLoading(false);
      return;
    }

    setParsedCount(partsToImport.length);

    saveParts([...parts, ...partsToImport]);
    toast.success(`${partsToImport.length} قطعه با موفقیت وارد شد`);
    setDataText("");
    setParsedCount(0);
    onSuccess();

    if (duplicates > 0) {
      toast.warning(`${duplicates} SKU تکراری بود و حذف شد`);
    }

    if (errors > 0) {
      toast.warning(`${errors} سطر دارای خطا بود و حذف شد`);
    }

    setLoading(false);
  };

  return (
    <Card className="p-6 border-warning/20 shadow-md bg-warning-light/5">
      <h3 className="text-xl font-bold mb-4 text-warning flex items-center">
        <Upload className="ml-2 h-6 w-6" />
        ورود دسته‌ای از اکسل/متن
      </h3>

      <div className="text-sm text-foreground p-3 bg-warning-light rounded-lg border border-warning/20 mb-4">
        <p className="font-semibold mb-2">راهنمای کپی:</p>
        <p className="font-mono text-center bg-card p-2 rounded-md border text-xs">
          نام | SKU | دسته | پکیج | مکان | موجودی | MPN | Datasheet URL
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          داده‌ها باید با Tab یا کاما (,) از هم جدا شوند
        </p>
      </div>

      <Textarea
        placeholder="داده‌ها را از اکسل کپی و در اینجا بچسبانید..."
        value={dataText}
        onChange={(e) => setDataText(e.target.value)}
        rows={8}
        className="font-mono text-left mb-4 bg-card"
        dir="ltr"
      />

      <div className="flex gap-4">
        <Button
          onClick={parseAndImport}
          disabled={loading || !dataText.trim()}
          className="flex-1 bg-gradient-warning hover:opacity-90 shadow-warning transition-smooth"
        >
          {loading ? (
            "در حال پردازش..."
          ) : (
            <>
              <CheckCircle className="ml-2 h-4 w-4" />
              پردازش و ثبت ({parsedCount > 0 ? `${parsedCount} سطر` : '...'})
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
