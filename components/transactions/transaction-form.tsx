"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Transaction,
  TransactionFormData,
  CATEGORY_LABELS,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
} from "@/types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface TransactionFormProps {
  userId: string;
  transaction?: Transaction;
  onSuccess: () => void;
}

export function TransactionForm({ userId, transaction, onSuccess }: TransactionFormProps) {
  const router = useRouter();
  const isEditing = !!transaction;

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<TransactionFormData>({
    type: transaction?.type ?? "expense",
    amount: transaction?.amount ?? 0,
    description: transaction?.description ?? "",
    category: transaction?.category ?? "outros",
    date: transaction?.date ?? new Date().toISOString().split("T")[0],
  });

  const categories = form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function handleTypeChange(type: "income" | "expense") {
    const newCats = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    setForm((prev) => ({
      ...prev,
      type,
      category: newCats.includes(prev.category) ? prev.category : newCats[0],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.amount <= 0) {
      toast.error("O valor deve ser maior que zero");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Informe uma descrição");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const payload = {
      user_id: userId,
      type: form.type,
      amount: Number(form.amount),
      description: form.description.trim(),
      category: form.category,
      date: form.date,
    };

    let error;
    if (isEditing) {
      ({ error } = await supabase
        .from("transactions")
        .update(payload)
        .eq("id", transaction.id));
    } else {
      ({ error } = await supabase.from("transactions").insert(payload));
    }

    setLoading(false);

    if (error) {
      toast.error("Erro ao salvar transação");
      return;
    }

    toast.success(isEditing ? "Transação atualizada!" : "Transação adicionada!");
    router.refresh();
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Tipo</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange("income")}
            className={`py-2 px-4 rounded-lg text-sm font-medium border transition-all ${
              form.type === "income"
                ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Receita
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("expense")}
            className={`py-2 px-4 rounded-lg text-sm font-medium border transition-all ${
              form.type === "expense"
                ? "bg-red-50 border-red-300 text-red-700"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Despesa
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Valor (R$)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0,00"
          value={form.amount || ""}
          onChange={(e) => setForm((p) => ({ ...p, amount: parseFloat(e.target.value) || 0 }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          type="text"
          placeholder="Ex: Supermercado, Salário..."
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          required
          maxLength={100}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select
          value={form.category}
          onValueChange={(v) => setForm((p) => ({ ...p, category: v as typeof p.category }))}
        >
          <SelectTrigger id="category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Data</Label>
        <Input
          id="date"
          type="date"
          value={form.date}
          onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : isEditing ? (
          "Salvar alterações"
        ) : (
          "Adicionar transação"
        )}
      </Button>
    </form>
  );
}
