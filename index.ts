import { HTMLUtils } from './HTMLUtils';
import { SimuladorColas } from './SimuladorColas';
import './style.css';

const tablaSimulacionDinamica: HTMLTableElement = document.getElementById('tablaSimulacionDinamica') as HTMLTableElement;

const simulador: SimuladorColas = new SimuladorColas();
simulador.simular(10, 1);

let matriz: any[][] = simulador.getMatrizEstado();
HTMLUtils.completarEncabezadosDeTabla(simulador.getCantMaxPasajerosEnSistema(), tablaSimulacionDinamica);
HTMLUtils.limpiarTabla(tablaSimulacionDinamica);
for (let i: number = 0; i < matriz.length; i++) {
  HTMLUtils.agregarFilaATabla(matriz[i], tablaSimulacionDinamica);
}