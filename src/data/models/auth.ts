import { UserRole } from "@/app/api/types/user";
import client from "../client";
import { HTTP_STATUS } from "@/constants/common";

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  user: null | IUser;
}

interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userRole: UserRole
}

interface ILoginPayload {
  email: string;
  password: string;
}


interface IRegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  nationalIdNumber: string;
  address: string;
  phoneNumber: string;
  userRole: 'BUSINESS' | 'CUSTOMER';
  businessRegId?: string;
}

export const auth = {
  state: {
    isLoggedIn: false,
    user: null,
  } as AuthState,
  reducers: {
    setLoggedIn(state: AuthState, payload: boolean) {
      return { ...state, isLoggedIn: payload };
    },
    setUser(state: AuthState, payload: AuthState['user']) {
      return { ...state, ...payload };
    },
    setLogout(state: AuthState) {
      return { ...state, isLoggedIn: false, user: null };
    },
  },
  effects: (dispatch: any) => ({
    async login(payload: ILoginPayload) {
      
      const result = await client.post('/api/v1/auth/login', payload)

      if (result.status === HTTP_STATUS.OK) {
        dispatch.auth.setLoggedIn(true);
        dispatch.auth.setUser({
          user: result.data.user,
          token: result.data.token
        })

        localStorage.setItem('access_token', result.data.token);
      }
      
    },
    async fetchUser() {
    },
    async register(payload: IRegisterPayload) {
      await client.post('/api/v1/auth/register', payload)
    },
    async forgotPassword(payload: { email: string; }) {
    },
    async logout() {
      dispatch.auth.setLogout();
      localStorage.removeItem('access_token');
    }
  })
};