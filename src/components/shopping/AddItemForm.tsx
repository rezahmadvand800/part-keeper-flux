import { useState } from 'react';
import { ShoppingItem } from './ShoppingList';
import { X, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface AddItemFormProps {
  onAdd: (item: Omit<ShoppingItem, 'id' | 'sort_order'>) => void;
  onClose: () => void;
  existingGroups: string[];
}

interface Supplier {
  name: string;
  price: number;
}

export function AddItemForm({ onAdd, onClose, existingGroups }: AddItemFormProps) {
  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [groupName, setGroupName] = useState(existingGroups[0] || 'عمومی');
  const [color, setColor] = useState('#6366f1');
  const [shortInfo, setShortInfo] = useState('');
  const [fullInfo, setFullInfo] = useState('');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierPrice, setNewSupplierPrice] = useState(0);

  const handleAddSupplier = () => {
    if (!newSupplierName || newSupplierPrice <= 0) return;
    
    setSuppliers([...suppliers, { name: newSupplierName, price: newSupplierPrice }]);
    setNewSupplierName('');
    setNewSupplierPrice(0);
  };

  const handleRemoveSupplier = (index: number) => {
    setSuppliers(suppliers.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || quantity <= 0) return;

    onAdd({
      title,
      quantity,
      price,
      group_name: groupName,
      color,
      short_info: shortInfo,
      full_info: fullInfo,
      suppliers,
    });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-center">
          <h3 className="text-xl font-bold text-foreground">افزودن آیتم جدید</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Main Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان آیتم *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="نام قطعه یا محصول"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">تعداد *</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">قیمت واحد (ریال)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                min="0"
                step="1000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="group">گروه</Label>
              <Input
                id="group"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="نام گروه"
                list="existing-groups"
              />
              <datalist id="existing-groups">
                {existingGroups.map(group => (
                  <option key={group} value={group} />
                ))}
              </datalist>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">رنگ</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-20 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 font-mono"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Description Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shortInfo">توضیحات کوتاه</Label>
              <Input
                id="shortInfo"
                value={shortInfo}
                onChange={(e) => setShortInfo(e.target.value)}
                placeholder="توضیح خلاصه در یک خط"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullInfo">توضیحات کامل</Label>
              <Textarea
                id="fullInfo"
                value={fullInfo}
                onChange={(e) => setFullInfo(e.target.value)}
                placeholder="اطلاعات تکمیلی و جزئیات"
                rows={3}
              />
            </div>
          </div>

          {/* Suppliers Section */}
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

            {suppliers.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {suppliers.map((supplier, index) => (
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

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg">
            افزودن به لیست خرید
          </Button>
        </form>
      </div>
    </div>
  );
}
