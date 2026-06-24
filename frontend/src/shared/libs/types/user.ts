export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: User;
}

interface User {
  id: number;
  username: string;
  email?: string;
}
