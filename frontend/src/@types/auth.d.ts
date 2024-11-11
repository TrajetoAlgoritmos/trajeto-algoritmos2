interface IUser {
  id: number;
  name: string;
  email: string;
  profileId: number;
}

interface IAuthResponse {
  data: {
    user: IUser;
    accessToken: {
      type: string;
      token: string;
      expiresAt: string;
    };
  };
}

interface IAuthContextProps {
  user: IUser | undefined;
  handleSignIn: () => Promise<void>;
  devSignInWithToken: (token: string) => Promise<void>;
}
