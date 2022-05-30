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
const cantEncabezadosTablaSimulacion = tablaSimulacion.rows[0].cells.length;
const cantSubEncabezadosTablaSimulacion = tablaSimulacion.rows[1].cells.length;
const tablaSimulacionAlternativa: HTMLTableElement = document.getElementById('tablaSimulacionAlternativa') as HTMLTableElement;
const cantEncabezadosTablaSimulacionAlt = tablaSimulacionAlternativa.rows[0].cells.length;
const cantSubEncabezadosTablaSimulacionAlt = tablaSimulacionAlternativa.rows[1].cells.length;

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
    // Simulación juntando las ventanillas de venta y facturación.
    case "1": {
      var startTime = performance.now()
      HTMLUtils.limpiarTabla(tablaSimulacionAlternativa, cantEncabezadosTablaSimulacionAlt, cantSubEncabezadosTablaSimulacionAlt);
      HTMLUtils.mostrarSeccion(divTablaSimulacionAlternativa);
      HTMLUtils.ocultarSeccion(divTablaSimulacion);
      console.log(`La limpieza tardó ${performance.now() - startTime} milisegundos`);

      // Realizamos la simulación alternativa.
      startTime = performance.now()
      await simuladorAlternativo.simular(n, eventoDesde);
      console.log(`La simulación tardó ${performance.now() - startTime} milisegundos`);

      let matrizEstado: any[][] = simuladorAlternativo.getMatrizEstado();

      // Cargamos la tabla a mostrar.
      startTime = performance.now()
      HTMLUtils.completarEncabezadosDeTablaAlternativa(simuladorAlternativo.getCantMaxPasajerosEnSistema(), tablaSimulacionAlternativa);
      for (let i: number = 0; i < matrizEstado.length; i++) {
        HTMLUtils.agregarFilaATablaAlternativa(matrizEstado[i], tablaSimulacionAlternativa);
      }
      console.log(`La renderización tardó ${performance.now() - startTime} milisegundos`);
      break;
    }

    // Simulación con las ventanillas de venta y facturación separadas.
    case "2": {
      var startTime = performance.now();
      HTMLUtils.limpiarTabla(tablaSimulacion, cantEncabezadosTablaSimulacion, cantSubEncabezadosTablaSimulacion);
      HTMLUtils.mostrarSeccion(divTablaSimulacion);
      HTMLUtils.ocultarSeccion(divTablaSimulacionAlternativa);
      console.log(`La limpieza tardó ${performance.now() - startTime} milisegundos`);

      // Realizamos la simulación.
      startTime = performance.now()
      await simulador.simular(n, eventoDesde);
      console.log(`La simulación tardó ${performance.now() - startTime} milisegundos`);

      let matrizEstado: any[][] = simulador.getMatrizEstado();

      // Cargamos la tabla a mostrar.
      startTime = performance.now()
      HTMLUtils.completarEncabezadosDeTabla(simulador.getCantMaxPasajerosEnSistema(), tablaSimulacion);
      for (let i: number = 0; i < matrizEstado.length; i++) {
        HTMLUtils.agregarFilaATabla(matrizEstado[i], tablaSimulacion);
      }
      console.log(`La renderización tardó ${performance.now() - startTime} milisegundos`);
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
    alert('Seleccione si desea juntar las ventanillas.');
    return false;
  }

  n = Number(txtCantNros.value);
  eventoDesde = Number(txtEventoDesde.value);

  if (n <= 0) {
    alert('La cantidad de eventos a generar debe ser mayor a cero.');
    return false;
  }
  if (eventoDesde < 0 || eventoDesde > n) {
    alert('El evento desde ingresado debe estar comprendido entre 0 y ' + n + '.');
    return false;
  }
  return true;
}