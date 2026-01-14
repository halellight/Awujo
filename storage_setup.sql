-- 1. Create the bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('reports', 'reports', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public to upload images (Anonymous Insert)
CREATE POLICY "Allow public uploads" 
ON storage.objects FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'reports');

-- 3. Allow public to view these images
CREATE POLICY "Allow public read access" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'reports');

-- 4. Allow admin to manage everything in the bucket (including Delete)
CREATE POLICY "Allow admin full access" 
ON storage.objects FOR ALL 
TO public 
USING (bucket_id = 'reports' AND auth.jwt() ->> 'email' = 'praiseibec@gmail.com')
WITH CHECK (bucket_id = 'reports' AND auth.jwt() ->> 'email' = 'praiseibec@gmail.com');
