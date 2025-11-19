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
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors" />
          <Input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="جستجو در عنوان، توضیحات یا گروه..."
            className="pr-12 h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <Button 
          onClick={onExport} 
          variant="outline" 
          className="gap-2 h-12 px-6 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
        >
          <Download className="w-5 h-5" />
          خروجی JSON
        </Button>
      </div>

      {/* Group Filter Tabs */}
      {groups.length > 1 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <div className="p-2 rounded-lg bg-primary/10">
              <Filter className="w-4 h-4 text-primary" />
            </div>
            <span>فیلتر گروه:</span>
          </div>
          <Tabs value={selectedGroup} onValueChange={onGroupChange} dir="rtl" className="flex-1">
            <TabsList className="flex-wrap h-auto gap-2 bg-transparent p-0">
              {groups.map((group) => (
                <TabsTrigger 
                  key={group} 
                  value={group} 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                >
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
