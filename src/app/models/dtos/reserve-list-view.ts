export interface ReserveListView{
  vehicleName: string;
  vehicleMarca?: string;
  vehiclePreco: number;
  vehicleDescricao: string;
  imagem?: string[];
  dataInicial?: string;
  dataFinal?: string;
  veiculoId: number;
  usuarioId: number;
}
