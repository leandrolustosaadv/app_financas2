-- FinançasPessoais - Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Transactions table
create table if not exists public.transactions (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  type        text not null check (type in ('income', 'expense')),
  amount      numeric(12, 2) not null check (amount > 0),
  description text not null,
  category    text not null check (
    category in (
      'alimentacao', 'transporte', 'moradia', 'saude',
      'educacao', 'lazer', 'vestuario', 'salario',
      'freelance', 'investimento', 'outros'
    )
  ),
  date        date not null,
  created_at  timestamptz not null default now()
);

-- Indexes for performance
create index if not exists transactions_user_id_idx on public.transactions(user_id);
create index if not exists transactions_date_idx on public.transactions(date desc);
create index if not exists transactions_user_date_idx on public.transactions(user_id, date desc);

-- Row Level Security
alter table public.transactions enable row level security;

-- RLS Policies: users can only access their own transactions
create policy "Users can view own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own transactions"
  on public.transactions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own transactions"
  on public.transactions for delete
  using (auth.uid() = user_id);
