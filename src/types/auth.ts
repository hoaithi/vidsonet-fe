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

// export interface AuthResponse {
//   accessToken: string;
//   refreshToken: string;
//   tokenType?: string;
//   profileId?: string;
//   fullName?: string;
//   user: 
// }

export interface GoogleLoginRequest {
  code: string;
}


export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  profileId?: string;
  fullName?: string;
  user: User; // Thêm user vào đây
}

// Định nghĩa User interface
export interface User {
  id: string;
  username: string;
  roles: Role[];
}

// Định nghĩa Role interface
export interface Role {
  name: string;
  description: string;
  permissions: Permission[];
}

// Định nghĩa Permission interface (nếu cần)
export interface Permission {
  name: string;
  description?: string;
}
