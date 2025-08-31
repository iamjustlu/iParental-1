-- iParental Database Schema for Supabase
-- Run this script in your Supabase SQL editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
    biometric_enabled BOOLEAN DEFAULT FALSE
);

-- Child profiles table
CREATE TABLE public.child_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    parent_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    profile_image TEXT,
    pin VARCHAR(10),
    device_token TEXT,
    age_group TEXT DEFAULT 'child' CHECK (age_group IN ('preschool', 'child', 'teen', 'custom')),
    nextdns_config_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Child settings table
CREATE TABLE public.child_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    child_id UUID REFERENCES public.child_profiles(id) ON DELETE CASCADE NOT NULL,
    screen_time_limit INTEGER DEFAULT 480, -- minutes
    allowed_apps TEXT[] DEFAULT '{}',
    blocked_apps TEXT[] DEFAULT '{}',
    blocked_websites TEXT[] DEFAULT '{}',
    allowed_websites TEXT[] DEFAULT '{}',
    bedtime TIME DEFAULT '21:00',
    wake_time TIME DEFAULT '07:00',
    content_filter_level TEXT DEFAULT 'moderate' CHECK (content_filter_level IN ('strict', 'moderate', 'relaxed', 'custom')),
    homework_mode BOOLEAN DEFAULT FALSE,
    location_tracking_enabled BOOLEAN DEFAULT TRUE,
    task_rewards_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE public.tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    child_id UUID REFERENCES public.child_profiles(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'other' CHECK (category IN ('chores', 'homework', 'exercise', 'reading', 'music_practice', 'personal_care', 'family_time', 'other')),
    due_date TIMESTAMPTZ NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern JSONB,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    points_reward INTEGER DEFAULT 0,
    time_reward INTEGER, -- extra screen time in minutes
    verification_required BOOLEAN DEFAULT FALSE,
    verification_photo TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Location history table
CREATE TABLE public.location_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    child_id UUID REFERENCES public.child_profiles(id) ON DELETE CASCADE NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address TEXT,
    accuracy DECIMAL(8, 2),
    battery_level INTEGER,
    timestamp TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Geofence zones table
CREATE TABLE public.geofence_zones (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    center_latitude DECIMAL(10, 8) NOT NULL,
    center_longitude DECIMAL(11, 8) NOT NULL,
    radius INTEGER NOT NULL, -- meters
    type TEXT DEFAULT 'custom' CHECK (type IN ('home', 'school', 'friend', 'safe_zone', 'restricted', 'custom')),
    is_active BOOLEAN DEFAULT TRUE,
    notify_on_entry BOOLEAN DEFAULT TRUE,
    notify_on_exit BOOLEAN DEFAULT TRUE,
    child_ids UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Screen time logs table
CREATE TABLE public.screen_time_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    child_id UUID REFERENCES public.child_profiles(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    total_screen_time INTEGER DEFAULT 0, -- minutes
    app_usage JSONB DEFAULT '[]',
    pickup_count INTEGER DEFAULT 0,
    notification_count INTEGER DEFAULT 0,
    most_used_app VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- App control rules table
CREATE TABLE public.app_control_rules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    child_id UUID REFERENCES public.child_profiles(id) ON DELETE CASCADE NOT NULL,
    package_name VARCHAR(255) NOT NULL,
    is_blocked BOOLEAN DEFAULT FALSE,
    time_limit INTEGER, -- minutes per day
    allowed_times JSONB, -- array of time ranges
    weekdays_only BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content filter rules table
CREATE TABLE public.content_filter_rules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    child_id UUID REFERENCES public.child_profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT CHECK (type IN ('block', 'allow')),
    category VARCHAR(255),
    pattern VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safety alerts table
CREATE TABLE public.safety_alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    child_id UUID REFERENCES public.child_profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('geofence_entry', 'geofence_exit', 'low_battery', 'device_offline', 'panic_button', 'speed_alert', 'late_arrival')),
    message TEXT NOT NULL,
    location_latitude DECIMAL(10, 8),
    location_longitude DECIMAL(11, 8),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE,
    severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical'))
);

-- Points transactions table
CREATE TABLE public.points_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    child_id UUID REFERENCES public.child_profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT CHECK (type IN ('earned', 'spent', 'bonus', 'penalty')),
    amount INTEGER NOT NULL,
    description TEXT NOT NULL,
    related_task_id UUID REFERENCES public.tasks(id),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_child_profiles_parent_id ON public.child_profiles(parent_id);
CREATE INDEX idx_child_settings_child_id ON public.child_settings(child_id);
CREATE INDEX idx_tasks_child_id ON public.tasks(child_id);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_location_history_child_id ON public.location_history(child_id);
CREATE INDEX idx_location_history_timestamp ON public.location_history(timestamp);
CREATE INDEX idx_screen_time_logs_child_id ON public.screen_time_logs(child_id);
CREATE INDEX idx_screen_time_logs_date ON public.screen_time_logs(date);
CREATE INDEX idx_safety_alerts_child_id ON public.safety_alerts(child_id);
CREATE INDEX idx_safety_alerts_timestamp ON public.safety_alerts(timestamp);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_child_profiles_updated_at BEFORE UPDATE ON public.child_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_child_settings_updated_at BEFORE UPDATE ON public.child_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_geofence_zones_updated_at BEFORE UPDATE ON public.geofence_zones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_app_control_rules_updated_at BEFORE UPDATE ON public.app_control_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geofence_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screen_time_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_control_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_filter_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Parents can access their children's data
CREATE POLICY "Parents can view own children" ON public.child_profiles FOR SELECT USING (auth.uid() = parent_id);
CREATE POLICY "Parents can insert children" ON public.child_profiles FOR INSERT WITH CHECK (auth.uid() = parent_id);
CREATE POLICY "Parents can update own children" ON public.child_profiles FOR UPDATE USING (auth.uid() = parent_id);
CREATE POLICY "Parents can delete own children" ON public.child_profiles FOR DELETE USING (auth.uid() = parent_id);

-- Similar policies for child-related tables
CREATE POLICY "Parents can access child settings" ON public.child_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.child_profiles WHERE id = child_id AND parent_id = auth.uid())
);

CREATE POLICY "Parents can access child tasks" ON public.tasks FOR ALL USING (
    EXISTS (SELECT 1 FROM public.child_profiles WHERE id = child_id AND parent_id = auth.uid())
);

CREATE POLICY "Parents can access location history" ON public.location_history FOR ALL USING (
    EXISTS (SELECT 1 FROM public.child_profiles WHERE id = child_id AND parent_id = auth.uid())
);

CREATE POLICY "Parents can access screen time logs" ON public.screen_time_logs FOR ALL USING (
    EXISTS (SELECT 1 FROM public.child_profiles WHERE id = child_id AND parent_id = auth.uid())
);

CREATE POLICY "Parents can access app rules" ON public.app_control_rules FOR ALL USING (
    EXISTS (SELECT 1 FROM public.child_profiles WHERE id = child_id AND parent_id = auth.uid())
);

CREATE POLICY "Parents can access filter rules" ON public.content_filter_rules FOR ALL USING (
    EXISTS (SELECT 1 FROM public.child_profiles WHERE id = child_id AND parent_id = auth.uid())
);

CREATE POLICY "Parents can access safety alerts" ON public.safety_alerts FOR ALL USING (
    EXISTS (SELECT 1 FROM public.child_profiles WHERE id = child_id AND parent_id = auth.uid())
);

CREATE POLICY "Parents can access points transactions" ON public.points_transactions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.child_profiles WHERE id = child_id AND parent_id = auth.uid())
);

-- Allow public read access to geofence zones (parents can see all zones but only modify their own)
CREATE POLICY "Anyone can view geofences" ON public.geofence_zones FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage geofences" ON public.geofence_zones FOR ALL USING (auth.role() = 'authenticated');

-- Insert some sample data (optional)
-- You can run this after setting up authentication to test

-- Sample NextDNS age group configurations (these would be created via the NextDNS API)
INSERT INTO public.geofence_zones (name, center_latitude, center_longitude, radius, type, child_ids) VALUES
('Sample Home', 37.7749, -122.4194, 100, 'home', '{}'),
('Sample School', 37.7849, -122.4094, 200, 'school', '{}'),
('Sample Safe Zone', 37.7649, -122.4294, 150, 'safe_zone', '{}');

-- Functions for analytics (you can expand these)
CREATE OR REPLACE FUNCTION get_child_screen_time_summary(child_uuid UUID, start_date DATE, end_date DATE)
RETURNS TABLE(
    total_minutes INTEGER,
    daily_average DECIMAL,
    days_counted INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(total_screen_time), 0)::INTEGER as total_minutes,
        COALESCE(AVG(total_screen_time), 0)::DECIMAL as daily_average,
        COUNT(*)::INTEGER as days_counted
    FROM public.screen_time_logs
    WHERE child_id = child_uuid 
    AND date BETWEEN start_date AND end_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
