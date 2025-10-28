export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  fullName?: string;
  dob?: string; // ISO date string (YYYY-MM-DD)
  email: string;
  city?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  profileId?: string;
  fullName?: string;
}

export interface GoogleLoginRequest {
  code: string;
}

