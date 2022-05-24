// Import stylesheets
import { Empleado } from './Empleado';
import { SimuladorColas } from './SimuladorColas';
import './style.css';

const simulador: SimuladorColas = new SimuladorColas();
simulador.simular(3, 1);

console.log(simulador.getMatrizEstado())