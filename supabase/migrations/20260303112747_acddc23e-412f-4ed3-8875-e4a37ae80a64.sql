
-- Drop restrictive SELECT policies on products
DROP POLICY IF EXISTS "Users can view own products" ON public.products;
DROP POLICY IF EXISTS "Admins can view all products" ON public.products;

-- Create a single permissive SELECT policy for all authenticated users
CREATE POLICY "Authenticated users can view all products"
  ON public.products FOR SELECT
  TO authenticated
  USING (true);

-- Also allow all authenticated users to read profiles (for username display)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Authenticated users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);
