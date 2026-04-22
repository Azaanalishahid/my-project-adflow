export type UserRole = 'client' | 'moderator' | 'admin';

export type AdStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'approved' 
  | 'rejected' 
  | 'payment_pending' 
  | 'verified' 
  | 'published' 
  | 'expired';

export type AdPackage = 'basic' | 'standard' | 'premium';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Ad {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  city: string;
  category: string;
  image_url: string;
  package: AdPackage;
  status: AdStatus;
  created_at: string;
  published_at?: string;
  expires_at?: string;
  profiles?: { email: string };
  payments?: Payment[];
}

export interface Payment {
  id: string;
  ad_id: string;
  transaction_id: string;
  amount: number;
  status: 'pending' | 'verified';
  created_at: string;
}
