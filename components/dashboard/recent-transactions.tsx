import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Transaction, CATEGORY_LABELS } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold text-slate-700">
          Transações Recentes
        </CardTitle>
        <Button variant="ghost" size="sm" render={<Link href="/transactions" />} className="text-blue-600 text-xs">
          Ver todas
        </Button>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
            Nenhuma transação registrada
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {t.type === "income" ? (
                    <ArrowUpCircle className="h-8 w-8 text-emerald-500" />
                  ) : (
                    <ArrowDownCircle className="h-8 w-8 text-red-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{t.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{formatDate(t.date)}</span>
                    <Badge variant="secondary" className="text-xs py-0">
                      {CATEGORY_LABELS[t.category]}
                    </Badge>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold flex-shrink-0 ${
                    t.type === "income" ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
