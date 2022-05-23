// Import stylesheets
import { Empleado } from './Empleado';
import { SimuladorColas } from './SimuladorColas';
import './style.css';

const simulador: SimuladorColas = new SimuladorColas();
simulador.simular(2, 1);

console.log(simulador.getMatrizEstado())

var empleado: Empleado = new Empleado();
console.log(empleado.toString())

let tiposPasajeros: Map<string, number> = new Map<string, number>([
  ["A", 0.3],
  ["B", 0.45],
  ["C", 1]
]);

console.log(tiposPasajeros)