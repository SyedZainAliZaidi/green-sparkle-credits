-- Create submissions table
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  phone_number TEXT,
  credits_earned INTEGER NOT NULL DEFAULT 0,
  co2_prevented NUMERIC(10, 2) NOT NULL DEFAULT 0,
  cookstove_type TEXT NOT NULL DEFAULT 'Clean Cookstove',
  verified BOOLEAN DEFAULT false,
  transaction_hash TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('Asia/Karachi', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('Asia/Karachi', now())
);

-- Enable RLS
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow anyone to insert (for now, can be restricted later)
CREATE POLICY "Anyone can insert submissions"
  ON public.submissions
  FOR INSERT
  WITH CHECK (true);

-- Allow users to view their own submissions
CREATE POLICY "Users can view their own submissions"
  ON public.submissions
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow public read for community feed
CREATE POLICY "Public can view verified submissions"
  ON public.submissions
  FOR SELECT
  USING (verified = true);

-- Create storage bucket for cookstove images
INSERT INTO storage.buckets (id, name, public)
VALUES ('cookstove-images', 'cookstove-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for cookstove images
CREATE POLICY "Anyone can upload cookstove images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'cookstove-images');

CREATE POLICY "Public can view cookstove images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'cookstove-images');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('Asia/Karachi', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for submissions
CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_submissions_created_at ON public.submissions(created_at DESC);
CREATE INDEX idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX idx_submissions_verified ON public.submissions(verified) WHERE verified = true;