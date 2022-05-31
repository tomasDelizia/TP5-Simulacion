export interface Simulador {
  simular(cantEventos: number, eventoDesde: number): Promise<void>;
  getMatrizEstado(): any[][];
  getCantMaxPasajerosEnSistema(): number;
}