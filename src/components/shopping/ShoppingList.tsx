import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ShoppingListBoard } from './ShoppingListBoard';
import { AddItemForm } from './AddItemForm';
import { ShoppingListStats } from './ShoppingListStats';
import { ShoppingListControls } from './ShoppingListControls';
import { EditItemModal } from './EditItemModal';
import { Plus } from 'lucide-react';
import { ShoppingItem, safeLoadFromStorage, safeSaveToStorage, ShoppingItemSchema } from '@/lib/validation';

const STORAGE_KEY = 'shopping_list_items';

export function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    const loadedItems = safeLoadFromStorage(STORAGE_KEY, ShoppingItemSchema);
    setItems(loadedItems);
    setIsLoading(false);
  };

  const groups = useMemo(() => {
    const groupSet = new Set(items.map(item => item.group_name));
    return ['all', ...Array.from(groupSet)];
  }, [items]);

  const filteredItems = useMemo(() => {
    let result = items;
    
    if (selectedGroup !== 'all') {
      result = result.filter(item => item.group_name === selectedGroup);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(term) ||
        item.short_info?.toLowerCase().includes(term) ||
        item.group_name.toLowerCase().includes(term)
      );
    }
    
    return result;
  }, [items, selectedGroup, searchTerm]);

  const handleAddItem = (itemData: Omit<ShoppingItem, 'id' | 'sort_order'>) => {
    try {
      const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.sort_order)) : 0;
      
      const newItem: ShoppingItem = {
        ...itemData,
        id: crypto.randomUUID(),
        sort_order: maxOrder + 1,
      };

      const newItems = [...items, newItem];
      
      if (safeSaveToStorage(STORAGE_KEY, newItems, ShoppingItemSchema)) {
        setItems(newItems);
        toast({
          title: 'آیتم افزوده شد',
          description: `${itemData.title} با موفقیت به لیست اضافه شد`,
        });
        setIsFormOpen(false);
        setSelectedGroup(itemData.group_name);
      } else {
        throw new Error('خطا در ذخیره‌سازی');
      }
    } catch (error) {
      toast({
        title: 'خطا در افزودن',
        description: 'امکان افزودن آیتم وجود ندارد',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateItem = (itemData: ShoppingItem) => {
    try {
      const newItems = items.map(item => item.id === itemData.id ? itemData : item);
      
      if (safeSaveToStorage(STORAGE_KEY, newItems, ShoppingItemSchema)) {
        setItems(newItems);
        toast({
          title: 'آیتم به‌روزرسانی شد',
          description: 'تغییرات با موفقیت ذخیره شد',
        });
        setEditingItem(null);
      } else {
        throw new Error('خطا در ذخیره‌سازی');
      }
    } catch (error) {
      toast({
        title: 'خطا در به‌روزرسانی',
        description: 'امکان به‌روزرسانی آیتم وجود ندارد',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteItem = (id: string) => {
    if (!confirm('آیا از حذف این آیتم اطمینان دارید؟')) return;

    try {
      const newItems = items.filter(item => item.id !== id);
      
      if (safeSaveToStorage(STORAGE_KEY, newItems, ShoppingItemSchema)) {
        setItems(newItems);
        toast({
          title: 'آیتم حذف شد',
          description: 'آیتم با موفقیت از لیست حذف شد',
        });
      } else {
        throw new Error('خطا در ذخیره‌سازی');
      }
    } catch (error) {
      toast({
        title: 'خطا در حذف',
        description: 'امکان حذف آیتم وجود ندارد',
        variant: 'destructive',
      });
    }
  };

  const handleReorder = (reorderedItems: ShoppingItem[]) => {
    try {
      const reindexed = reorderedItems.map((item, index) => ({
        ...item,
        sort_order: index,
      }));
      
      if (safeSaveToStorage(STORAGE_KEY, reindexed, ShoppingItemSchema)) {
        setItems(reindexed);
      }
    } catch (error) {
      toast({
        title: 'خطا در مرتب‌سازی',
        description: 'امکان تغییر ترتیب آیتم‌ها وجود ندارد',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">لیست خرید بازرگانی</h2>
          <p className="text-sm text-muted-foreground mt-1">
            مدیریت سفارشات و لیست خرید از تامین‌کنندگان
          </p>
        </div>
      </div>

      <ShoppingListStats items={items} />

      <ShoppingListControls
        groups={groups}
        selectedGroup={selectedGroup}
        onGroupChange={setSelectedGroup}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onExport={() => {
          const dataStr = JSON.stringify(items, null, 2);
          const dataBlob = new Blob([dataStr], { type: 'application/json' });
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `shopping-list-${new Date().toISOString().split('T')[0]}.json`;
          link.click();
          URL.revokeObjectURL(url);
        }}
      />

      <ShoppingListBoard
        items={filteredItems}
        onEdit={setEditingItem}
        onDelete={handleDeleteItem}
        onReorder={handleReorder}
      />

      {/* Floating Action Button */}
      <button
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-8 left-8 w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
        aria-label="افزودن آیتم جدید"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Item Form */}
      {isFormOpen && (
        <AddItemForm
          onAdd={handleAddItem}
          onClose={() => setIsFormOpen(false)}
          existingGroups={groups.filter(g => g !== 'all')}
        />
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <EditItemModal
          item={editingItem}
          onUpdate={handleUpdateItem}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}
