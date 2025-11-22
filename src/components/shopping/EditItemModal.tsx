import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ShoppingItem } from '@/lib/validation';

interface EditItemModalProps {
  item: ShoppingItem;
  onUpdate: (item: ShoppingItem) => void;
  onClose: () => void;
}

export function EditItemModal({ item, onUpdate, onClose }: EditItemModalProps) {
  const [formData, setFormData] = useState({
    title: item.title,
    quantity: item.quantity,
    price: item.price,
    group_name: item.group_name,
    color: item.color,
    short_info: item.short_info || '',
    full_info: item.full_info || '',
    suppliers: item.suppliers || [],
  });
  
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierPrice, setNewSupplierPrice] = useState(0);

  const handleAddSupplier = () => {
    if (!newSupplierName || newSupplierPrice <= 0) return;
    
    setFormData({
      ...formData,
      suppliers: [...formData.suppliers, { name: newSupplierName, price: newSupplierPrice }],
    });
    setNewSupplierName('');
    setNewSupplierPrice(0);
  };

  const handleRemoveSupplier = (index: number) => {
    setFormData({
      ...formData,
      suppliers: formData.suppliers.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onUpdate({
      ...item,
      ...formData,
    });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-center">
          <h3 className="text-xl font-bold text-foreground">ویرایش آیتم</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">عنوان آیتم</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-quantity">تعداد</Label>
              <Input
                id="edit-quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-price">قیمت واحد (ریال)</Label>
              <Input
                id="edit-price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                min="0"
                step="1000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-group">گروه</Label>
              <Input
                id="edit-group"
                value={formData.group_name}
                onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-color">رنگ</Label>
              <div className="flex gap-2">
                <Input
                  id="edit-color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-20 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="flex-1 font-mono"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-shortInfo">توضیحات کوتاه</Label>
              <Input
                id="edit-shortInfo"
                value={formData.short_info}
                onChange={(e) => setFormData({ ...formData, short_info: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-fullInfo">توضیحات کامل</Label>
              <Textarea
                id="edit-fullInfo"
                value={formData.full_info}
                onChange={(e) => setFormData({ ...formData, full_info: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4 border-t border-border pt-6">
            <h4 className="font-semibold text-foreground">تامین‌کنندگان</h4>
            
            <div className="flex gap-2">
              <Input
                value={newSupplierName}
                onChange={(e) => setNewSupplierName(e.target.value)}
                placeholder="نام تامین‌کننده"
                className="flex-1"
              />
              <Input
                type="number"
                value={newSupplierPrice}
                onChange={(e) => setNewSupplierPrice(parseFloat(e.target.value) || 0)}
                placeholder="قیمت"
                className="w-32"
                min="0"
                step="1000"
              />
              <Button
                type="button"
                onClick={handleAddSupplier}
                size="icon"
                variant="secondary"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {formData.suppliers.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {formData.suppliers.map((supplier, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-accent/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <span className="font-medium">{supplier.name}</span>
                      <span className="text-sm text-muted-foreground mr-2">
                        {new Intl.NumberFormat('fa-IR', {
                          style: 'currency',
                          currency: 'IRR',
                          maximumFractionDigits: 0,
                        }).format(supplier.price)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSupplier(index)}
                      className="p-1 hover:bg-destructive hover:text-destructive-foreground rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              انصراف
            </Button>
            <Button type="submit" className="flex-1">
              ذخیره تغییرات
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
