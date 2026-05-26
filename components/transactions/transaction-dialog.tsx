"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionForm } from "./transaction-form";
import { Transaction } from "@/types";
import React from "react";

interface TransactionDialogProps {
  userId: string;
  transaction?: Transaction;
  trigger: React.ReactElement;
}

export function TransactionDialog({ userId, transaction, trigger }: TransactionDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Editar transação" : "Nova transação"}
          </DialogTitle>
        </DialogHeader>
        <TransactionForm
          userId={userId}
          transaction={transaction}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
