-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'client' CHECK (role IN ('client', 'moderator', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create ads table
CREATE TABLE IF NOT EXISTS public.ads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    city TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    package TEXT NOT NULL CHECK (package IN ('basic', 'standard', 'premium')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'payment_pending', 'verified', 'published', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ad_id UUID REFERENCES public.ads(id) ON DELETE CASCADE NOT NULL,
    transaction_id TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profiles" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Ads Policies
CREATE POLICY "Published ads are viewable by everyone" ON public.ads FOR SELECT USING (status = 'published');
CREATE POLICY "Users can view their own ads" ON public.ads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Moderators and admins can view all ads" ON public.ads FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin'))
);
CREATE POLICY "Users can insert their own ads" ON public.ads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own ads" ON public.ads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Moderators and admins can update ads" ON public.ads FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin'))
);

-- Payments Policies
CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.ads WHERE ads.id = ad_id AND ads.user_id = auth.uid())
);
CREATE POLICY "Admins can view all payments" ON public.payments FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can insert their own payments" ON public.payments FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.ads WHERE ads.id = ad_id AND ads.user_id = auth.uid())
);
CREATE POLICY "Admins can update payments" ON public.payments FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'role', 'client'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
