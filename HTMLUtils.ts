export module HTMLUtils {

  // Función para ocultar un elemento div.
  export function ocultarSeccion(div: HTMLDivElement): void {
    div.style.display = 'none';
  }

  // Función para mostrar un elemento div.
  export function mostrarSeccion(div: HTMLDivElement): void {
    div.style.display = 'block';
  }

  // Función que elimina todas las filas de la tabla HTML excepto los encabezados.
  export function limpiarTabla(tabla: HTMLTableElement) {
    for (let i: number = tabla.rows.length; i > 1; i--) {
      tabla.deleteRow(i - 1);
    }
  }

  // Agregar una fila a una tabla html a partir de un vector pasado por parámetro.
  export function agregarFilaATabla(fila: any[], tabla: HTMLTableElement) {
  let filaHTML: HTMLTableRowElement = tabla.getElementsByTagName('tbody')[0].insertRow();
  for (let i: number = 0; i < fila.length; i++) {
    const valor: string = !(typeof fila[i] === 'undefined' || fila[i] === '') ? String(fila[i]) : '-';
    let celda: HTMLTableDataCellElement = filaHTML.insertCell();
    celda.appendChild(document.createTextNode(valor));
    }
  }

  // Completa los encabezados de la tabla con los datos de los pasajeros.
  export function completarEncabezadosDeTabla(cantPasajeros: number, tabla: HTMLTableElement): void {
    let encabezados: HTMLTableRowElement = tabla.rows[0];

    for (let i: number = 0; i < cantPasajeros; i++) {
      let colNroPasajero: HTMLTableHeaderCellElement = encabezados.insertCell();
      colNroPasajero.appendChild(document.createTextNode('N° Pasajero'));

      let colTipoPasajero: HTMLTableHeaderCellElement = encabezados.insertCell();
      colTipoPasajero.appendChild(document.createTextNode('Tipo Pasajero'));
      
      let colEstadoPasajero: HTMLTableHeaderCellElement = encabezados.insertCell();
      colEstadoPasajero.appendChild(document.createTextNode('Estado'));

      let colMinutoLlegada: HTMLTableHeaderCellElement = encabezados.insertCell();
      colMinutoLlegada.appendChild(document.createTextNode('Minuto llegada'));
    }
  }  
}