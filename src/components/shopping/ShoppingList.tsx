import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ShoppingListBoard } from './ShoppingListBoard';
import { AddItemForm } from './AddItemForm';
import { ShoppingListStats } from './ShoppingListStats';
import { ShoppingListControls } from './ShoppingListControls';
import { EditItemModal } from './EditItemModal';
import { Plus } from 'lucide-react';

export interface ShoppingItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  group_name: string;
  color: string;
  short_info?: string;
  full_info?: string;
  suppliers: Array<{ name: string; price: number }>;
  width?: string;
  height?: string;
  sort_order: number;
}

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
    subscribeToChanges();
  }, []);

  const fetchItems = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('shopping_list_items')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      
      // Transform data to match ShoppingItem interface
      const transformedData = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        group_name: item.group_name,
        color: item.color,
        short_info: item.short_info,
        full_info: item.full_info,
        suppliers: Array.isArray(item.suppliers) ? item.suppliers as Array<{ name: string; price: number }> : [],
        width: item.width,
        height: item.height,
        sort_order: item.sort_order,
      }));
      
      setItems(transformedData);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast({
        title: 'خطا در بارگذاری',
        description: 'امکان بارگذاری لیست خرید وجود ندارد',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToChanges = () => {
    const channel = supabase
      .channel('shopping_list_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shopping_list_items',
        },
        () => {
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

  const handleAddItem = async (itemData: Omit<ShoppingItem, 'id' | 'sort_order'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.sort_order)) : 0;

      const { error } = await supabase
        .from('shopping_list_items')
        .insert({
          ...itemData,
          user_id: user.id,
          sort_order: maxOrder + 1,
        });

      if (error) throw error;

      toast({
        title: 'آیتم افزوده شد',
        description: `${itemData.title} با موفقیت به لیست اضافه شد`,
      });
      setIsFormOpen(false);
      setSelectedGroup(itemData.group_name);
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: 'خطا در افزودن',
        description: 'امکان افزودن آیتم وجود ندارد',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateItem = async (itemData: ShoppingItem) => {
    try {
      const { id, ...updateData } = itemData;
      const { error } = await supabase
        .from('shopping_list_items')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'آیتم به‌روزرسانی شد',
        description: 'تغییرات با موفقیت ذخیره شد',
      });
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: 'خطا در به‌روزرسانی',
        description: 'امکان به‌روزرسانی آیتم وجود ندارد',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('آیا از حذف این آیتم اطمینان دارید؟')) return;

    try {
      const { error } = await supabase
        .from('shopping_list_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'آیتم حذف شد',
        description: 'آیتم با موفقیت از لیست حذف شد',
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: 'خطا در حذف',
        description: 'امکان حذف آیتم وجود ندارد',
        variant: 'destructive',
      });
    }
  };

  const handleReorder = async (reorderedItems: ShoppingItem[]) => {
    try {
      const updates = reorderedItems.map((item, index) => ({
        id: item.id,
        sort_order: index,
      }));

      for (const update of updates) {
        await supabase
          .from('shopping_list_items')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id);
      }

      setItems(reorderedItems);
    } catch (error) {
      console.error('Error reordering items:', error);
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
