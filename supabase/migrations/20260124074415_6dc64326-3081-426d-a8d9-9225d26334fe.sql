-- Update category slugs to match existing tour category values
UPDATE categories SET slug = 'dhow-cruise' WHERE slug = 'dhow';

-- Add category_id column to tours with foreign key reference
ALTER TABLE tours ADD COLUMN category_id UUID REFERENCES categories(id);

-- Populate category_id from existing text category field
UPDATE tours t
SET category_id = c.id
FROM categories c
WHERE t.category = c.slug;

-- Create index for performance on category lookups
CREATE INDEX idx_tours_category_id ON tours(category_id);

-- Create a database function to get categories with tour counts
CREATE OR REPLACE FUNCTION get_categories_with_tour_counts()
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  description TEXT,
  icon TEXT,
  sort_order INTEGER,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  tour_count BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    c.id,
    c.name,
    c.slug,
    c.description,
    c.icon,
    c.sort_order,
    c.is_active,
    c.created_at,
    c.updated_at,
    COUNT(t.id) as tour_count
  FROM categories c
  LEFT JOIN tours t ON t.category_id = c.id AND t.status = 'active'
  GROUP BY c.id
  ORDER BY c.sort_order;
$$;