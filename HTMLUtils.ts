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
    for (let i: number = tabla.rows.length; i > 2; i--) {
      tabla.deleteRow(i - 1);
    }
  }

  // Agregar una fila a una tabla html a partir de un vector pasado por parámetro.
  export function agregarFilaATabla(fila: any[], tabla: HTMLTableElement) {
  let filaHTML: HTMLTableRowElement = tabla.getElementsByTagName('tbody')[0].insertRow();
  for (let i: number = 0; i < fila.length; i++) {
    const valor: string = !(typeof fila[i] === 'undefined' || String(fila[i]) == 'null' || fila[i] === '') ? String(fila[i]) : '-';
    /* if (i == 5 || i == 9 || i == 11 || i == 14 || i == 20 || i == 23 || i == 26 || i == 29 || i == 32) {
      let celda: HTMLTableDataCellElement = filaHTML.insertCell();
      celda.style.color = "red"
      celda.appendChild(document.createTextNode(valor));
    }
    */
    let celda: HTMLTableDataCellElement = filaHTML.insertCell();
    celda.appendChild(document.createTextNode(valor));
    }
  }

  // Completa los encabezados de la tabla con los datos de los pasajeros.
  export function completarEncabezadosDeTabla(cantPasajeros: number, tabla: HTMLTableElement): void {
    let encabezados: HTMLTableRowElement = tabla.rows[0];
    let subEncabezados: HTMLTableRowElement = tabla.rows[1];

    for (let i: number = 0; i < cantPasajeros; i++) {
      let colPasajero: HTMLTableHeaderCellElement = encabezados.insertCell();
      colPasajero.colSpan = 4;
      colPasajero.appendChild(document.createTextNode('Pasajero N° ' + i+1));

      let colNroPasajero: HTMLTableHeaderCellElement = subEncabezados.insertCell();
      colNroPasajero.appendChild(document.createTextNode('N° Pasajero'));

      let colTipoPasajero: HTMLTableHeaderCellElement = subEncabezados.insertCell();
      colTipoPasajero.appendChild(document.createTextNode('Tipo Pasajero'));
      
      let colEstadoPasajero: HTMLTableHeaderCellElement = subEncabezados.insertCell();
      colEstadoPasajero.appendChild(document.createTextNode('Estado'));

      let colMinutoLlegada: HTMLTableHeaderCellElement = subEncabezados.insertCell();
      colMinutoLlegada.appendChild(document.createTextNode('Minuto llegada'));
    }
  }  
}