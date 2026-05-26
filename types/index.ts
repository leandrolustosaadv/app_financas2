export type TransactionType = "income" | "expense";

export type Category =
  | "alimentacao"
  | "transporte"
  | "moradia"
  | "saude"
  | "educacao"
  | "lazer"
  | "vestuario"
  | "salario"
  | "freelance"
  | "investimento"
  | "outros";

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: Category;
  date: string;
  created_at: string;
}

export interface TransactionFormData {
  type: TransactionType;
  amount: number;
  description: string;
  category: Category;
  date: string;
}

export interface MonthlySummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface CategoryTotal {
  category: Category;
  total: number;
  label: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  alimentacao: "Alimentação",
  transporte: "Transporte",
  moradia: "Moradia",
  saude: "Saúde",
  educacao: "Educação",
  lazer: "Lazer",
  vestuario: "Vestuário",
  salario: "Salário",
  freelance: "Freelance",
  investimento: "Investimento",
  outros: "Outros",
};

export const INCOME_CATEGORIES: Category[] = [
  "salario",
  "freelance",
  "investimento",
  "outros",
];

export const EXPENSE_CATEGORIES: Category[] = [
  "alimentacao",
  "transporte",
  "moradia",
  "saude",
  "educacao",
  "lazer",
  "vestuario",
  "outros",
];

export const CATEGORY_COLORS: Record<Category, string> = {
  alimentacao: "#f97316",
  transporte: "#3b82f6",
  moradia: "#8b5cf6",
  saude: "#ec4899",
  educacao: "#06b6d4",
  lazer: "#84cc16",
  vestuario: "#f59e0b",
  salario: "#10b981",
  freelance: "#14b8a6",
  investimento: "#6366f1",
  outros: "#94a3b8",
};
