import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2, Package, TrendingUp, History, BarChart3, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import Dashboard from "@/components/inventory/Dashboard";
import PartsInventory from "@/components/inventory/PartsInventory";
import TransactionForm from "@/components/inventory/TransactionForm";
import TransactionHistory from "@/components/inventory/TransactionHistory";
import { ShoppingList } from "@/components/shopping/ShoppingList";

export default function Inventory() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("با موفقیت خارج شدید");
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-4 md:p-8" dir="rtl">
      <header className="bg-card p-6 rounded-2xl shadow-lg mb-6 border border-primary/10 animate-fade-in">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              سیستم مدیریت موجودی انبار
            </h1>
            <p className="text-sm text-muted-foreground">
              کاربر: <span className="font-semibold text-foreground">{user?.email}</span>
            </p>
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="gap-2 hover:bg-destructive hover:text-destructive-foreground transition-smooth"
          >
            <LogOut className="h-4 w-4" />
            خروج
          </Button>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6 bg-card p-1 rounded-xl shadow-md border border-primary/10">
          <TabsTrigger value="dashboard" className="gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground transition-smooth">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">داشبورد</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground transition-smooth">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">قطعات</span>
          </TabsTrigger>
          <TabsTrigger value="transaction" className="gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground transition-smooth">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">تراکنش</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground transition-smooth">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">تاریخچه</span>
          </TabsTrigger>
          <TabsTrigger value="shopping" className="gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground transition-smooth">
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">بازرگانی</span>
          </TabsTrigger>
        </TabsList>

        <div className="bg-card p-6 rounded-2xl shadow-lg border border-primary/10 animate-fade-in">
          <TabsContent value="dashboard" className="mt-0">
            <Dashboard />
          </TabsContent>
          <TabsContent value="inventory" className="mt-0">
            <PartsInventory />
          </TabsContent>
          <TabsContent value="transaction" className="mt-0">
            <TransactionForm />
          </TabsContent>
          <TabsContent value="history" className="mt-0">
            <TransactionHistory />
          </TabsContent>
          <TabsContent value="shopping" className="mt-0">
            <ShoppingList />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
