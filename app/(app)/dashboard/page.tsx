import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { ExpensesChart } from "@/components/dashboard/expenses-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { Transaction, CategoryTotal, CATEGORY_LABELS } from "@/types";
import { getCurrentMonthRange, getMonthYearLabel } from "@/lib/utils/format";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { start, end } = getCurrentMonthRange();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", start)
    .lte("date", end)
    .order("date", { ascending: false });

  const txList = (transactions ?? []) as Transaction[];

  const totalIncome = txList
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = txList
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const expensesByCategory: CategoryTotal[] = Object.entries(
    txList
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] ?? 0) + t.amount;
        return acc;
      }, {} as Record<string, number>)
  ).map(([category, total]) => ({
    category: category as Transaction["category"],
    total,
    label: CATEGORY_LABELS[category as Transaction["category"]],
  }));

  const recentTransactions = txList.slice(0, 5);
  const monthLabel = getMonthYearLabel(start);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm capitalize">{monthLabel}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          title="Receitas"
          value={totalIncome}
          icon={TrendingUp}
          variant="income"
        />
        <SummaryCard
          title="Despesas"
          value={totalExpenses}
          icon={TrendingDown}
          variant="expense"
        />
        <SummaryCard
          title="Saldo"
          value={balance}
          icon={Wallet}
          variant="balance"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpensesChart data={expensesByCategory} />
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  );
}
