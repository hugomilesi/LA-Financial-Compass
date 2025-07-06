-- Create table for KPI goals
CREATE TABLE public.kpi_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  kpi_name TEXT NOT NULL,
  goal_value NUMERIC NOT NULL,
  unit_id TEXT NOT NULL DEFAULT 'all',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, kpi_name, unit_id)
);

-- Enable Row Level Security
ALTER TABLE public.kpi_goals ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own KPI goals" 
ON public.kpi_goals 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own KPI goals" 
ON public.kpi_goals 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own KPI goals" 
ON public.kpi_goals 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own KPI goals" 
ON public.kpi_goals 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_kpi_goals_updated_at
BEFORE UPDATE ON public.kpi_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();