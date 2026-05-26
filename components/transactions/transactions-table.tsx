import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Transaction, CATEGORY_LABELS } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { Pencil, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { TransactionDialog } from "./transaction-dialog";
import { DeleteButton } from "./delete-button";

interface TransactionsTableProps {
  transactions: Transaction[];
  userId: string;
}

export function TransactionsTable({ transactions, userId }: TransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 flex items-center justify-center h-48 text-slate-400 text-sm">
        Nenhuma transação encontrada
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="text-xs font-semibold text-slate-500 w-10"></TableHead>
            <TableHead className="text-xs font-semibold text-slate-500">Descrição</TableHead>
            <TableHead className="text-xs font-semibold text-slate-500 hidden sm:table-cell">Categoria</TableHead>
            <TableHead className="text-xs font-semibold text-slate-500 hidden md:table-cell">Data</TableHead>
            <TableHead className="text-xs font-semibold text-slate-500 text-right">Valor</TableHead>
            <TableHead className="text-xs font-semibold text-slate-500 text-right w-20">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t) => (
            <TableRow key={t.id} className="hover:bg-slate-50/50">
              <TableCell className="py-3">
                {t.type === "income" ? (
                  <ArrowUpCircle className="h-5 w-5 text-emerald-500" />
                ) : (
                  <ArrowDownCircle className="h-5 w-5 text-red-400" />
                )}
              </TableCell>
              <TableCell className="py-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">{t.description}</p>
                  <p className="text-xs text-slate-400 sm:hidden">{formatDate(t.date)}</p>
                </div>
              </TableCell>
              <TableCell className="py-3 hidden sm:table-cell">
                <Badge variant="secondary" className="text-xs">
                  {CATEGORY_LABELS[t.category]}
                </Badge>
              </TableCell>
              <TableCell className="py-3 hidden md:table-cell text-sm text-slate-500">
                {formatDate(t.date)}
              </TableCell>
              <TableCell className="py-3 text-right">
                <span
                  className={`text-sm font-semibold ${
                    t.type === "income" ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </span>
              </TableCell>
              <TableCell className="py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <TransactionDialog
                    userId={userId}
                    transaction={t}
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-blue-500"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <DeleteButton transactionId={t.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
