export interface IUserRegisterResponse {
  token: string;
  usuario: {
    id: number;
    nome: string;
    login: string;
  };
}
