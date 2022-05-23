// Import stylesheets
import { SimuladorColas } from './SimuladorColas';
import './style.css';

const simulador: SimuladorColas = new SimuladorColas();
await simulador.simular(2, 1);

console.log(simulador.getMatrizEstado())