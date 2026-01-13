-- CivicPulse NG Schema Setup

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    status TEXT DEFAULT 'Planned' CHECK (status IN ('Planned', 'In Progress', 'Completed', 'Stalled')),
    budget_allocated NUMERIC DEFAULT 0,
    budget_spent NUMERIC DEFAULT 0,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Project Reports Table
CREATE TABLE IF NOT EXISTS public.project_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    submitter_name TEXT NOT NULL,
    submitter_email TEXT NOT NULL,
    report_content TEXT NOT NULL,
    evidence_url TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Published', 'Rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Policies Table
CREATE TABLE IF NOT EXISTS public.policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT,
    description TEXT,
    official_url TEXT,
    published_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;

-- Policies for public reading
CREATE POLICY "Allow public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public read published reports" ON public.project_reports FOR SELECT USING (status = 'Published');
CREATE POLICY "Allow public read policies" ON public.policies FOR SELECT USING (true);

-- Policy for public submission of reports
CREATE POLICY "Allow public submission" ON public.project_reports FOR INSERT WITH CHECK (true);

-- Admin policies (You will need to be authenticated as admin to use these)
-- For now, these are placeholders. In a real scenario, we'd check auth.role() or a custom claim.
-- 4. Petitions Table
CREATE TABLE IF NOT EXISTS public.petitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    target_authority TEXT,
    expected_signatures INTEGER DEFAULT 1000,
    current_signatures INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'Closed', 'Under Review', 'Resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Representatives Table
CREATE TABLE IF NOT EXISTS public.representatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL, -- e.g., 'Senator', 'House Member'
    constituency TEXT NOT NULL,
    state TEXT NOT NULL,
    party TEXT,
    image_url TEXT,
    contact_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for new tables
ALTER TABLE public.petitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.representatives ENABLE ROW LEVEL SECURITY;

-- Policies for public reading
CREATE POLICY "Allow public read petitions" ON public.petitions FOR SELECT USING (true);
CREATE POLICY "Allow public read representatives" ON public.representatives FOR SELECT USING (true);

-- Admin policies
CREATE POLICY "Allow admin all access petitions" ON public.petitions FOR ALL USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE email = 'praiseibec@gmail.com'));
CREATE POLICY "Allow admin all access representatives" ON public.representatives FOR ALL USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE email = 'praiseibec@gmail.com'));

-- 6. Project Updates (for pictures and timeline)
CREATE TABLE IF NOT EXISTS public.project_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    update_text TEXT NOT NULL,
    image_url TEXT,
    update_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Project Comments (for citizen feedback)
CREATE TABLE IF NOT EXISTS public.project_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL DEFAULT 'Anonymous Citizen',
    comment_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read updates" ON public.project_updates FOR SELECT USING (true);
CREATE POLICY "Allow public read comments" ON public.project_comments FOR SELECT USING (true);

-- Public insert access for comments
CREATE POLICY "Allow public post comments" ON public.project_comments FOR INSERT WITH CHECK (true);

-- Admin access
CREATE POLICY "Allow admin all access updates" ON public.project_updates FOR ALL USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE email = 'praiseibec@gmail.com'));
CREATE POLICY "Allow admin all access comments" ON public.project_comments FOR ALL USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE email = 'praiseibec@gmail.com'));
