export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
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

