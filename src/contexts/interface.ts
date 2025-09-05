export interface iContextUserProps {
  children: React.ReactNode;
}


export interface iDataRegister {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface iDataLogin {
  email: string;
  password: string;
}

export interface iResponse {
  token: string;
  user: iUserResponse;
}

export interface iUserResponse {
  email: string;
  name: string;
  id: number;
}

export interface iUserContext {
  loading: boolean;
  registerUser: (data: iDataRegister) => Promise<void>;
  login: (data: iDataLogin) => Promise<void>;
  logout: () => void;
  loadingForm: boolean;
}
