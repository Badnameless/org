export interface User {
  user_id: number;
  user_name: string;
  user_email: string;
  email_verified_at: string;
  user_photoUrl?: string;
  roles: roles | undefined;
}

interface roles{
  name: string[];
}

