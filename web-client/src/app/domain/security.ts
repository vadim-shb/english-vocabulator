import {User} from "./user";

export class SecurityEmailPasswordCredentials {
  email: string;
  password: string;
}

export class SecurityAuthenticationResponseUser {
  id: number;
  email: string;
}

export class SecurityAuthenticationResponse {
  accessToken: string;
  user: SecurityAuthenticationResponseUser;
}
