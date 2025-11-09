-- Add likes column to submissions table
ALTER TABLE public.submissions 
ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_submissions_likes ON public.submissions(likes DESC);

-- Enable realtime for submissions table
ALTER TABLE public.submissions REPLICA IDENTITY FULL;