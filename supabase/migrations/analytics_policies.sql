-- Page Views Policies
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Allow all users to insert page views
CREATE POLICY "Enable page view insertion for all users"
ON page_views FOR INSERT
TO public
WITH CHECK (true);

-- Only allow admins to view all page views
CREATE POLICY "Enable page view read for admins"
ON page_views FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  )
);

-- Events Policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow all users to create events
CREATE POLICY "Enable event insertion for all users"
ON events FOR INSERT
TO public
WITH CHECK (true);

-- Only allow admins to view all events
CREATE POLICY "Enable event read for admins"
ON events FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  )
);

-- Blog Analytics Policies
ALTER TABLE blog_analytics ENABLE ROW LEVEL SECURITY;

-- Allow public read access to blog analytics
CREATE POLICY "Enable blog analytics read for everyone"
ON blog_analytics FOR SELECT
TO public
USING (true);

-- Only allow system to update blog analytics
CREATE POLICY "Enable blog analytics update for system"
ON blog_analytics FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- Visitors Policies
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Allow all users to insert visitor data
CREATE POLICY "Enable visitor insertion for all users"
ON visitors FOR INSERT
TO public
WITH CHECK (true);

-- Only allow admins to view visitor data
CREATE POLICY "Enable visitor read for admins"
ON visitors FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  )
);

-- Create admin role function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create analytics access function
CREATE OR REPLACE FUNCTION get_analytics_access()
RETURNS TABLE (
  can_view boolean,
  can_edit boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN is_admin() THEN true
      ELSE false
    END as can_view,
    CASE 
      WHEN is_admin() THEN true
      ELSE false
    END as can_edit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to aggregate analytics
CREATE OR REPLACE FUNCTION get_dashboard_analytics(
  start_date timestamp,
  end_date timestamp
)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  WITH stats AS (
    SELECT
      COUNT(DISTINCT session_id) as unique_visitors,
      COUNT(*) as page_views,
      COUNT(DISTINCT path) as unique_pages
    FROM page_views
    WHERE timestamp BETWEEN start_date AND end_date
  )
  SELECT json_build_object(
    'visitors', (SELECT unique_visitors FROM stats),
    'pageViews', (SELECT page_views FROM stats),
    'uniquePages', (SELECT unique_pages FROM stats)
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
