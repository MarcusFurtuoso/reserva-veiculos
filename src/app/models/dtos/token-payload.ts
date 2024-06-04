export interface ITokenPayload {
  exp: number;
  iss: string;
  sub: string;
  user: UserAuthResponse;
}

export interface UserAuthResponse {
  authorities: string[];
  id: number;
  login: string;
  nome: string;
}

