-- Add subdomain support to the tenants table
-- This migration ensures that the subdomain column exists and is properly configured

-- Check if subdomain column already exists, add it if it doesn't
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tenants' 
    AND column_name = 'subdomain'
  ) THEN
    ALTER TABLE public.tenants ADD COLUMN subdomain TEXT;
  END IF;
END
$$;

-- Add unique constraint on subdomain (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'tenants_subdomain_key'
    AND conrelid = 'public.tenants'::regclass
  ) THEN
    ALTER TABLE public.tenants ADD CONSTRAINT tenants_subdomain_key UNIQUE (subdomain);
  END IF;
END
$$;

-- Add index on subdomain for faster lookups
CREATE INDEX IF NOT EXISTS idx_tenants_subdomain ON public.tenants (subdomain);

-- Ensure the subdomain is not null for all existing rows
UPDATE public.tenants
SET subdomain = LOWER(REPLACE(business_name, ' ', '-')) || '-' || SUBSTRING(id::text, 1, 8)
WHERE subdomain IS NULL;

-- Add a function to generate slugs from business names
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
DECLARE
  slug TEXT;
BEGIN
  -- Convert to lowercase
  slug := LOWER(input_text);
  
  -- Replace spaces and special characters with hyphens
  slug := REGEXP_REPLACE(slug, '[^a-z0-9]', '-', 'g');
  
  -- Replace multiple hyphens with a single one
  slug := REGEXP_REPLACE(slug, '-+', '-', 'g');
  
  -- Remove leading and trailing hyphens
  slug := TRIM(BOTH '-' FROM slug);
  
  RETURN slug;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create a function to ensure unique subdomains
CREATE OR REPLACE FUNCTION ensure_unique_subdomain()
RETURNS TRIGGER AS $$
DECLARE
  base_subdomain TEXT;
  final_subdomain TEXT;
  counter INTEGER := 1;
BEGIN
  -- Generate base subdomain from business_name
  base_subdomain := generate_slug(NEW.business_name);
  final_subdomain := base_subdomain;
  
  -- If subdomain is explicitly provided, use that instead
  IF NEW.subdomain IS NOT NULL THEN
    base_subdomain := NEW.subdomain;
    final_subdomain := base_subdomain;
  END IF;
  
  -- Check if the subdomain already exists and generate a unique one if needed
  WHILE EXISTS (
    SELECT 1 FROM public.tenants 
    WHERE subdomain = final_subdomain 
    AND id != NEW.id
  ) LOOP
    final_subdomain := base_subdomain || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  -- Set the final subdomain
  NEW.subdomain := final_subdomain;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to ensure unique subdomains when inserting/updating tenants
DROP TRIGGER IF EXISTS ensure_unique_subdomain_trigger ON public.tenants;

CREATE TRIGGER ensure_unique_subdomain_trigger
BEFORE INSERT OR UPDATE
ON public.tenants
FOR EACH ROW
EXECUTE FUNCTION ensure_unique_subdomain();

-- Update any null subdomains again to ensure they're unique
UPDATE public.tenants
SET subdomain = generate_slug(business_name) || '-' || SUBSTRING(id::text, 1, 8)
WHERE subdomain IS NULL;

-- Make subdomain not null after all existing rows have values
ALTER TABLE public.tenants ALTER COLUMN subdomain SET NOT NULL; 