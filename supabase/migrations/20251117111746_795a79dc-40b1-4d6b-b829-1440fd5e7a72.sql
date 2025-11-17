-- Create shopping_list_items table for commercial shopping management
CREATE TABLE public.shopping_list_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  group_name TEXT NOT NULL DEFAULT 'عمومی',
  color TEXT NOT NULL DEFAULT '#6366f1',
  short_info TEXT,
  full_info TEXT,
  suppliers JSONB DEFAULT '[]'::jsonb,
  width TEXT,
  height TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.shopping_list_items ENABLE ROW LEVEL SECURITY;

-- Create policies for shopping_list_items
CREATE POLICY "Users can view their own shopping items" 
ON public.shopping_list_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own shopping items" 
ON public.shopping_list_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shopping items" 
ON public.shopping_list_items 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shopping items" 
ON public.shopping_list_items 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_shopping_list_items_updated_at
BEFORE UPDATE ON public.shopping_list_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for shopping_list_items
ALTER PUBLICATION supabase_realtime ADD TABLE public.shopping_list_items;