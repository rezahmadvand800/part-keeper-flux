import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

interface Transaction {
  id: string;
  part_sku: string;
  type: string;
  quantity: number;
  date: string;
  created_at: string;
}

interface Part {
  sku: string;
  name: string;
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions'
        },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchData = async () => {
    const [transactionsResult, partsResult] = await Promise.all([
      supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase
        .from('parts')
        .select('sku, name')
    ]);

    if (transactionsResult.error) {
      console.error('Error fetching transactions:', transactionsResult.error);
    } else {
      setTransactions(transactionsResult.data || []);
    }

    if (partsResult.error) {
      console.error('Error fetching parts:', partsResult.error);
    } else {
      setParts(partsResult.data || []);
    }

    setLoading(false);
  };

  const getPartName = (sku: string) => {
    const part = parts.find(p => p.sku === sku);
    return part ? part.name : 'قطعه حذف شده/نامشخص';
  };

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
        📜 تاریخچه تراکنش‌های انبار
      </h2>

      <div className="overflow-x-auto rounded-xl border border-border shadow-md">
        <table className="w-full text-right border-collapse">
          <thead className="bg-gradient-primary text-primary-foreground">
            <tr>
              <th className="p-4 rounded-tr-xl">تاریخ</th>
              <th className="p-4">SKU</th>
              <th className="p-4">نام قطعه</th>
              <th className="p-4 text-center">نوع</th>
              <th className="p-4 text-center rounded-tl-xl">مقدار</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground bg-card">
                  هیچ تراکنشی ثبت نشده است
                </td>
              </tr>
            ) : (
              transactions.map((transaction, index) => {
                const isEntry = transaction.type === 'ورود';
                const rowClass = index % 2 === 0 ? 'bg-card' : 'bg-muted/30';

                return (
                  <tr
                    key={transaction.id}
                    className={`${rowClass} border-b border-border hover:bg-muted/50 transition-smooth animate-fade-in`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="p-4 text-muted-foreground persian-numbers">
                      {transaction.date}
                    </td>
                    <td className="p-4 font-mono text-left text-primary" dir="ltr">
                      {transaction.part_sku}
                    </td>
                    <td className="p-4 font-medium text-foreground">
                      {getPartName(transaction.part_sku)}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-bold ${
                          isEntry
                            ? 'bg-success-light text-success'
                            : 'bg-destructive-light text-destructive'
                        }`}
                      >
                        {isEntry ? (
                          <ArrowDownCircle className="h-4 w-4" />
                        ) : (
                          <ArrowUpCircle className="h-4 w-4" />
                        )}
                        {transaction.type}
                      </span>
                    </td>
                    <td
                      className={`p-4 text-center font-bold text-lg persian-numbers ${
                        isEntry ? 'text-success' : 'text-destructive'
                      }`}
                    >
                      {transaction.quantity.toLocaleString('fa-IR')}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
