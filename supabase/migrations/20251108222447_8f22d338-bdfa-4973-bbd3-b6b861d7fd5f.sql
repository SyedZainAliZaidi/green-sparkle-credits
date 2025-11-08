-- Create enum for transaction status
CREATE TYPE public.credit_status AS ENUM ('pending', 'confirmed');

-- Create credits_transactions table
CREATE TABLE public.credits_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  credits_earned INTEGER NOT NULL,
  transaction_hash TEXT NOT NULL,
  status public.credit_status NOT NULL DEFAULT 'pending',
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.credits_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own transactions"
ON public.credits_transactions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
ON public.credits_transactions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_credits_transactions_user_id ON public.credits_transactions(user_id);
CREATE INDEX idx_credits_transactions_created_at ON public.credits_transactions(created_at DESC);