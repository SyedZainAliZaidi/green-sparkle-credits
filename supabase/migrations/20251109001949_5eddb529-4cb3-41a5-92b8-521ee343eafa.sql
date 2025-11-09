-- Fix function search path security issue by dropping trigger first
DROP TRIGGER IF EXISTS update_submissions_updated_at ON public.submissions;
DROP FUNCTION IF EXISTS public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = timezone('Asia/Karachi', now());
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();