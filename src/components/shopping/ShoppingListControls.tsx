import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download, Filter } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ShoppingListControlsProps {
  groups: string[];
  selectedGroup: string;
  onGroupChange: (group: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onExport: () => void;
}

export function ShoppingListControls({
  groups,
  selectedGroup,
  onGroupChange,
  searchTerm,
  onSearchChange,
  onExport,
}: ShoppingListControlsProps) {
  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="جستجو در عنوان، توضیحات یا گروه..."
            className="pr-10"
          />
        </div>
        <Button onClick={onExport} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          خروجی JSON
        </Button>
      </div>

      {/* Group Filter Tabs */}
      {groups.length > 1 && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span>فیلتر گروه:</span>
          </div>
          <Tabs value={selectedGroup} onValueChange={onGroupChange} dir="rtl">
            <TabsList className="flex-wrap h-auto">
              {groups.map((group) => (
                <TabsTrigger key={group} value={group} className="text-sm">
                  {group === 'all' ? 'همه' : group}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}
    </div>
  );
}
