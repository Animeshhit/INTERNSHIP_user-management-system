export type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
};

export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
};
