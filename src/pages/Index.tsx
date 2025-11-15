import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package, ArrowLeft, Sparkles, Database, Zap } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in, redirect to inventory
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/inventory");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-4xl w-full space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-primary shadow-primary mb-4 animate-bounce">
            <Package className="h-10 w-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-primary bg-clip-text text-transparent">
            سیستم مدیریت موجودی انبار
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            مدیریت حرفه‌ای قطعات الکترونیکی و صنعتی با رابط کاربری مدرن و قابلیت‌های پیشرفته
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover:scale-105 transition-all duration-300 shadow-lg border-primary/20 animate-scale-in" style={{ animationDelay: '100ms' }}>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 rounded-full bg-primary/10">
                <Database className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">داشبورد جامع</h3>
              <p className="text-sm text-muted-foreground">
                مشاهده آمار کامل موجودی، مکان‌ها و تراکنش‌ها در یک نگاه
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:scale-105 transition-all duration-300 shadow-lg border-primary/20 animate-scale-in" style={{ animationDelay: '200ms' }}>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 rounded-full bg-success/10">
                <Zap className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-lg font-bold text-foreground">به‌روزرسانی لحظه‌ای</h3>
              <p className="text-sm text-muted-foreground">
                همگام‌سازی خودکار اطلاعات در تمام دستگاه‌ها
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:scale-105 transition-all duration-300 shadow-lg border-primary/20 animate-scale-in" style={{ animationDelay: '300ms' }}>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 rounded-full bg-accent/10">
                <Sparkles className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-foreground">ورود دسته‌ای</h3>
              <p className="text-sm text-muted-foreground">
                افزودن سریع قطعات از طریق کپی از اکسل
              </p>
            </div>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="bg-gradient-primary hover:opacity-90 shadow-primary transition-smooth text-lg px-8 py-6 group"
          >
            شروع کنید
            <ArrowLeft className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <Card className="p-6 bg-card/50 backdrop-blur border-primary/10">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground mb-2">ویژگی‌های کلیدی:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  مدیریت کامل اطلاعات قطعات (نام، SKU، MPN، دیتاشیت و...)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                  ثبت تراکنش‌های ورود و خروج با تاریخچه کامل
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                  جستجوی پیشرفته و فیلترهای هوشمند
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning"></span>
                  هشدار موجودی کم و گزارش‌گیری جامع
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
