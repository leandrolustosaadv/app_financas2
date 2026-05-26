import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { TransactionDialog } from "@/components/transactions/transaction-dialog";
import { TransactionsFilters } from "@/components/transactions/transactions-filters";
import { Transaction } from "@/types";
import { Suspense } from "react";

interface SearchParams {
  start?: string;
  end?: string;
  type?: string;
  category?: string;
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const { start, end, type, category } = params;

  let query = supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (start) query = query.gte("date", start);
  if (end) query = query.lte("date", end);
  if (type && type !== "all") query = query.eq("type", type);
  if (category && category !== "all") query = query.eq("category", category);

  const { data: transactions } = await query;
  const txList = (transactions ?? []) as Transaction[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Transações</h1>
          <p className="text-slate-500 text-sm">{txList.length} transação(ões) encontrada(s)</p>
        </div>
        <TransactionDialog
          userId={user.id}
          trigger={
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nova transação</span>
              <span className="sm:hidden">Nova</span>
            </Button>
          }
        />
      </div>

      <Suspense>
        <TransactionsFilters />
      </Suspense>

      <TransactionsTable transactions={txList} userId={user.id} />
    </div>
  );
}
