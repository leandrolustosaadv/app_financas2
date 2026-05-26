"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABELS } from "@/types";
import { X } from "lucide-react";

export function TransactionsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const startDate = searchParams.get("start") ?? "";
  const endDate = searchParams.get("end") ?? "";
  const type = searchParams.get("type") ?? "all";
  const category = searchParams.get("category") ?? "all";

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value && value !== "all") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.push(`/transactions?${params.toString()}`);
    },
    [router, searchParams]
  );

  function clearFilters() {
    router.push("/transactions");
  }

  const hasFilters = startDate || endDate || type !== "all" || category !== "all";

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Filtros</h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs text-slate-500 h-7 px-2"
          >
            <X className="h-3 w-3 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="space-y-1">
          <Label className="text-xs text-slate-500">Data inicial</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => updateParams({ start: e.target.value })}
            className="h-9 text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-slate-500">Data final</Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => updateParams({ end: e.target.value })}
            className="h-9 text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-slate-500">Tipo</Label>
          <Select
            value={type}
            onValueChange={(v) => updateParams({ type: v ?? "all" })}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="income">Receitas</SelectItem>
              <SelectItem value="expense">Despesas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-slate-500">Categoria</Label>
          <Select
            value={category}
            onValueChange={(v) => updateParams({ category: v ?? "all" })}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
