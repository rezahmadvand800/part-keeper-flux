import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import PartsTable from "./PartsTable";
import AddPartForm from "./AddPartForm";
import ImportPartsForm from "./ImportPartsForm";
import EditPartModal from "./EditPartModal";

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

export default function PartsInventory() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"add" | "import">("add");
  const [editingPart, setEditingPart] = useState<Part | null>(null);

  useEffect(() => {
    fetchParts();

    const channel = supabase
      .channel('parts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'parts'
        },
        () => fetchParts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchParts = async () => {
    const { data, error } = await supabase
      .from('parts')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching parts:', error);
      toast.error("خطا در دریافت لیست قطعات");
    } else {
      setParts(data || []);
    }
    setLoading(false);
  };

  const filteredParts = parts.filter(part => {
    const term = searchTerm.toLowerCase();
    return (
      part.name.toLowerCase().includes(term) ||
      part.sku.toLowerCase().includes(term) ||
      (part.mpn && part.mpn.toLowerCase().includes(term)) ||
      part.category.toLowerCase().includes(term) ||
      part.location.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">
        📦 مدیریت موجودی قطعات
      </h2>

      <div className="flex gap-3 mb-6">
        <Button
          onClick={() => setViewMode("add")}
          variant={viewMode === "add" ? "default" : "outline"}
          className={viewMode === "add" ? "bg-gradient-primary shadow-primary" : ""}
        >
          <Plus className="ml-2 h-4 w-4" />
          افزودن تکی
        </Button>
        <Button
          onClick={() => setViewMode("import")}
          variant={viewMode === "import" ? "default" : "outline"}
          className={viewMode === "import" ? "bg-gradient-warning shadow-warning" : ""}
        >
          <Upload className="ml-2 h-4 w-4" />
          ورود از اکسل
        </Button>
      </div>

      {viewMode === "add" ? (
        <AddPartForm onSuccess={fetchParts} />
      ) : (
        <ImportPartsForm onSuccess={fetchParts} />
      )}

      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="جستجو بر اساس نام، SKU، MPN یا مکان..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-12 transition-smooth"
        />
      </div>

      <PartsTable
        parts={filteredParts}
        onEdit={setEditingPart}
        searchTerm={searchTerm}
      />

      {editingPart && (
        <EditPartModal
          part={editingPart}
          onClose={() => setEditingPart(null)}
          onSuccess={fetchParts}
        />
      )}
    </div>
  );
}
