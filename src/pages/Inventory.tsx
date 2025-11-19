import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, TrendingUp, History, BarChart3, ShoppingCart, Warehouse } from "lucide-react";
import Dashboard from "@/components/inventory/Dashboard";
import PartsInventory from "@/components/inventory/PartsInventory";
import TransactionForm from "@/components/inventory/TransactionForm";
import TransactionHistory from "@/components/inventory/TransactionHistory";
import { ShoppingList } from "@/components/shopping/ShoppingList";

export default function Inventory() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-subtle p-4 md:p-8" dir="rtl">
      {/* Professional Header with Glassmorphism Effect */}
      <header className="relative overflow-hidden bg-card/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl mb-8 border border-primary/20 animate-fade-in">
        <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Warehouse className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-primary bg-clip-text text-transparent tracking-tight">
                سیستم مدیریت موجودی انبار
              </h1>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                نسخه آفلاین - ذخیره‌سازی محلی در مرورگر
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Professional Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8 bg-card/80 backdrop-blur-xl p-2 rounded-2xl shadow-xl border border-primary/10 h-auto">
          <TabsTrigger 
            value="dashboard" 
            className="gap-2 rounded-xl py-3 px-4 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-primary transition-all duration-300 hover:scale-105"
          >
            <BarChart3 className="h-5 w-5" />
            <span className="hidden sm:inline font-semibold">داشبورد</span>
          </TabsTrigger>
          <TabsTrigger 
            value="inventory" 
            className="gap-2 rounded-xl py-3 px-4 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-primary transition-all duration-300 hover:scale-105"
          >
            <Package className="h-5 w-5" />
            <span className="hidden sm:inline font-semibold">قطعات</span>
          </TabsTrigger>
          <TabsTrigger 
            value="transaction" 
            className="gap-2 rounded-xl py-3 px-4 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-primary transition-all duration-300 hover:scale-105"
          >
            <TrendingUp className="h-5 w-5" />
            <span className="hidden sm:inline font-semibold">تراکنش</span>
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="gap-2 rounded-xl py-3 px-4 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-primary transition-all duration-300 hover:scale-105"
          >
            <History className="h-5 w-5" />
            <span className="hidden sm:inline font-semibold">تاریخچه</span>
          </TabsTrigger>
          <TabsTrigger 
            value="shopping" 
            className="gap-2 rounded-xl py-3 px-4 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-primary transition-all duration-300 hover:scale-105"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="hidden sm:inline font-semibold">خرید</span>
          </TabsTrigger>
        </TabsList>

        {/* Professional Tab Content with Smooth Transitions */}
        <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-primary/10">
            <Dashboard />
          </div>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-6 animate-fade-in">
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-primary/10">
            <PartsInventory />
          </div>
        </TabsContent>
        
        <TabsContent value="transaction" className="space-y-6 animate-fade-in">
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-primary/10">
            <TransactionForm />
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-6 animate-fade-in">
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-primary/10">
            <TransactionHistory />
          </div>
        </TabsContent>
        
        <TabsContent value="shopping" className="space-y-6 animate-fade-in">
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-primary/10">
            <ShoppingList />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
