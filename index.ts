import { HTMLUtils } from './HTMLUtils';
import { SimuladorColas } from './SimuladorColas';
import { SimuladorColasAlternativo } from './SimuladorColasAlternativo';
import './style.css';

// Definición de los cuadros de texto de la interfaz de usuario.
const txtCantNros: HTMLInputElement = document.getElementById('txtCantNros') as HTMLInputElement;
const txtEventoDesde: HTMLInputElement = document.getElementById('txtEventoDesde') as HTMLInputElement;

// Definición de los combo box de la interfaz de usuario.
const cboJuntarVentanilla: HTMLSelectElement = document.getElementById('cboJuntarVentanilla') as HTMLSelectElement;

// Definición de la secciones de la simulación.
const divTablaSimulacion: HTMLDivElement = document.getElementById('divTablaSimulacion') as HTMLDivElement;
const divTablaSimulacionAlternativa: HTMLDivElement = document.getElementById('divTablaSimulacionAlternativa') as HTMLDivElement;

// Definición de la tablas de simulación de colas.
const tablaSimulacion: HTMLTableElement = document.getElementById('tablaSimulacion') as HTMLTableElement;
const tablaSimulacionAlternativa: HTMLTableElement = document.getElementById('tablaSimulacionAlternativa') as HTMLTableElement;

// Definición de botones de la interfaz de usuario.
const btnSimular: HTMLButtonElement = document.getElementById('btnSimular') as HTMLButtonElement;

// Definición de los objetos que realizan la simulación de colas.
const simulador: SimuladorColas = new SimuladorColas();
const simuladorAlternativo: SimuladorColasAlternativo = new SimuladorColasAlternativo();

// Definición de los parámetros.
let n: number;
let eventoDesde: number;

//Ocultamos la seccion en donde esta la tabla.
HTMLUtils.ocultarSeccion(divTablaSimulacion);
HTMLUtils.ocultarSeccion(divTablaSimulacionAlternativa);

// Disparamos la simulación.
btnSimular.addEventListener('click', async () => {
  await simular();
});

const simular = async () => {
  // Validamos los parámetros ingresados por el usuario.
  if (!validarParametros())
    return;

  switch (cboJuntarVentanilla.value) {
    case "1": {
      HTMLUtils.limpiarTabla(tablaSimulacionAlternativa);
      HTMLUtils.mostrarSeccion(tablaSimulacionAlternativa);
      HTMLUtils.ocultarSeccion(tablaSimulacion);
      break;
    }
    case "2": {
      HTMLUtils.limpiarTabla(tablaSimulacion);
      HTMLUtils.mostrarSeccion(tablaSimulacion);
      HTMLUtils.ocultarSeccion(tablaSimulacionAlternativa);

      // Realizamos la simulación.
      var startTime = performance.now()
      await simulador.simular(n, eventoDesde);

      let matrizEstado: any[][] = simulador.getMatrizEstado();

      // Cargamos la tabla a mostrar.
      HTMLUtils.completarEncabezadosDeTabla(simulador.getCantMaxPasajerosEnSistema(), tablaSimulacion);
      HTMLUtils.limpiarTabla(tablaSimulacion);
      for (let i: number = 0; i < matrizEstado.length; i++) {
        HTMLUtils.agregarFilaATabla(matrizEstado[i], tablaSimulacion);
      }
      var endTime = performance.now();
      console.log(`La simulación tardó ${endTime - startTime} milisegundos`);
      break;
    }
  }
}

// Validación de los parámetros del usuario.
function validarParametros(): boolean {
  if (txtCantNros.value === '' || txtEventoDesde.value === '') {
    alert('Tiene que ingresar todos los parámetros solicitados.');
    return false;
  }

  if ( Number(cboJuntarVentanilla.value) <= 0 || Number(cboJuntarVentanilla.value) > 2) {
    alert('Seleccione la cantidad de intervalos.');
    return false;
  }

  n = Number(txtCantNros.value);
  eventoDesde = Number(txtEventoDesde.value);

  if (n <= 0) {
    alert('La cantidad de números a generar debe ser mayor a cero.');
    return false;
  }
  if (eventoDesde < 0 || eventoDesde > n) {
    alert('El evento desde ingresado debe estar comprendido entre 0 y ' + n + '.');
    return false;
  }
  return true;
}