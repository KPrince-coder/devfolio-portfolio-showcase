-- Create technical_skills table
CREATE TABLE IF NOT EXISTS public.technical_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    icon_key TEXT NOT NULL DEFAULT 'code',
    skills TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create education table
CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    degree TEXT NOT NULL,
    institution TEXT NOT NULL,
    year_start TEXT NOT NULL,
    year_end TEXT,
    type TEXT NOT NULL, -- 'degree' or 'certification'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create technical_proficiency table
CREATE TABLE IF NOT EXISTS public.technical_proficiency (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill TEXT NOT NULL,
    proficiency INTEGER NOT NULL CHECK (proficiency >= 0 AND proficiency <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.technical_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technical_proficiency ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access for technical_skills" ON public.technical_skills
    FOR SELECT TO public USING (true);

CREATE POLICY "Public read access for education" ON public.education
    FOR SELECT TO public USING (true);

CREATE POLICY "Public read access for technical_proficiency" ON public.technical_proficiency
    FOR SELECT TO public USING (true);

-- Admin full access
CREATE POLICY "Admin full access for technical_skills" ON public.technical_skills
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

CREATE POLICY "Admin full access for education" ON public.education
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

CREATE POLICY "Admin full access for technical_proficiency" ON public.technical_proficiency
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE technical_skills;
ALTER PUBLICATION supabase_realtime ADD TABLE education;
ALTER PUBLICATION supabase_realtime ADD TABLE technical_proficiency;

-- Add some initial data
INSERT INTO technical_skills (category, icon_key, skills) VALUES
    ('Frontend Development', 'monitor', ARRAY['React/Next.js', 'TypeScript', 'Tailwind CSS', 'Redux/Context']),
    ('Backend Development', 'server', ARRAY['Node.js', 'Express', 'PostgreSQL', 'REST APIs']),
    ('Mobile Development', 'smartphone', ARRAY['Kotlin', 'Jetpack Compose', 'Android SDK', 'Material Design']),
    ('Cloud Services', 'cloud', ARRAY['AWS', 'Google Cloud', 'Docker', 'Kubernetes']),
    ('Database Management', 'database', ARRAY['PostgreSQL', 'MongoDB', 'Redis', 'Database Design']),
    ('Security', 'shield', ARRAY['OAuth 2.0', 'JWT', 'HTTPS', 'Data Encryption']);

INSERT INTO education (degree, institution, year_start, year_end, type) VALUES
    ('Bachelor of Science in Computer Science', 'University Name', '2018', '2022', 'degree'),
    ('AWS Certified Solutions Architect', 'Amazon Web Services', '2023', NULL, 'certification');

INSERT INTO technical_proficiency (skill, proficiency) VALUES
    ('React/Next.js', 90),
    ('TypeScript', 85),
    ('Node.js', 80),
    ('Python', 75),
    ('AWS', 70);
