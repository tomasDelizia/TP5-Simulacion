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
  export function limpiarTabla(tabla: HTMLTableElement, cantEncabezados: number, cantSubEncabezados: number) {
    for (let i: number = tabla.rows.length; i > 2; i--)
      tabla.deleteRow(i - 1);
 
    // Limpiamos los encabezados correspondientes a los pasajeros.
    for (let i: number = tabla.rows[0].cells.length; i > cantEncabezados; i--)
      tabla.rows[0].deleteCell(i - 1);

    for (let i: number = tabla.rows[1].cells.length; i > cantSubEncabezados; i--)
      tabla.rows[1].deleteCell(i - 1);  
  }

  // Crea una fila a una tabla html a partir de un vector pasado por parámetro.
  export function crearFila(fila: any[], indicesColor: number[]): string {
    let filaHTML: string = "<tr>";
    for (let i: number = 0; i < fila.length; i++) {
      let celdaHTML: string = "<td";
      for (let j: number = 0; j < indicesColor.length; j++) {
        if (i == indicesColor[j])
          celdaHTML += ' style="color: red"';
      }
      celdaHTML += ">";
      const valor: string = !(typeof fila[i] === 'undefined' || String(fila[i]) == 'null' || fila[i] === '') ? String(fila[i]) : '-';
      celdaHTML += valor + "</td>";
      filaHTML += celdaHTML;
    }
    filaHTML += "</tr>"
    return filaHTML;
  }

  // Carga de tabla html.
  export function llenarTabla(matriz: any[][], indicesColor: number[], tabla: HTMLTableElement): void {
    tabla.hidden = true;
    let bodyTabla: string = "";
    for (let i: number = 0; i < matriz.length; i++) {
      let filaHTML: string = crearFila(matriz[i], indicesColor);
      bodyTabla += filaHTML;
    }
    tabla.tBodies[0].innerHTML = bodyTabla;
    tabla.hidden = false;
  }

  // Completa los encabezados de la tabla con los datos de los pasajeros.
  export function completarEncabezadosPasajeros(cantPasajeros: number, tabla: HTMLTableElement, columnas: string[]): void {
    let encabezados: HTMLTableRowElement = tabla.rows[0];
    let subEncabezados: HTMLTableRowElement = tabla.rows[1];

    for (let i: number = 0; i < cantPasajeros; i++) {
      let col: HTMLTableHeaderCellElement = encabezados.insertCell();
      col.colSpan = columnas.length;
      col.style.fontWeight = "bold";
      col.appendChild(document.createTextNode('Pasajero N° ' + (i+1)));

      for (let j: number = 0; j < columnas.length; j++) {
        let subCol: HTMLTableHeaderCellElement = subEncabezados.insertCell();
        subCol.style.fontWeight = "bold";
        subCol.appendChild(document.createTextNode(columnas[j]));
      }
    }
  }

  // Completa los encabezados de la tabla con los datos de los pasajeros.
  export function completarEncabezadosDeTabla(cantPasajeros: number, tabla: HTMLTableElement): void {
    let encabezados: HTMLTableRowElement = tabla.rows[0];
    let subEncabezados: HTMLTableRowElement = tabla.rows[1];
    for (let i: number = 0; i < cantPasajeros; i++) {
      let colPasajero: HTMLTableHeaderCellElement = encabezados.insertCell();
      colPasajero.colSpan = 8;
      colPasajero.style.fontWeight = "bold";
      colPasajero.appendChild(document.createTextNode('Pasajero N° ' + (i+1)));

      let colNroPasajero: HTMLTableHeaderCellElement = subEncabezados.insertCell();
      colNroPasajero.style.fontWeight = "bold";
      colNroPasajero.appendChild(document.createTextNode('ID Pasajero'));

      let colTipoPasajero: HTMLTableHeaderCellElement = subEncabezados.insertCell();
      colTipoPasajero.style.fontWeight = "bold";
      colTipoPasajero.appendChild(document.createTextNode('Tipo Pasajero'));
      
      let colEstadoPasajero: HTMLTableHeaderCellElement = subEncabezados.insertCell();
      colEstadoPasajero.style.fontWeight = "bold";
      colEstadoPasajero.appendChild(document.createTextNode('Estado'));

      let colMinutoLlegada: HTMLTableHeaderCellElement = subEncabezados.insertCell();
      colMinutoLlegada.style.fontWeight = "bold";
      colMinutoLlegada.appendChild(document.createTextNode('Minuto llegada'));

      let colMinutoLlegadaDeVentaAFacturacion: HTMLTableHeaderCellElement = subEncabezados.insertCell();
      colMinutoLlegadaDeVentaAFacturacion.style.fontWeight = "bold";
      colMinutoLlegadaDeVentaAFacturacion.style.color = "red";
      colMinutoLlegadaDeVentaAFacturacion.appendChild(document.createTextNode('Minuto llegada de venta a facturación'));

      let colMinutoLlegadaDeFacturacionAControl: HTMLTableHeaderCellElement = subEncabezados.insertCell();
      colMinutoLlegadaDeFacturacionAControl.style.fontWeight = "bold";
      colMinutoLlegadaDeFacturacionAControl.style.color = "red";
      colMinutoLlegadaDeFacturacionAControl.appendChild(document.createTextNode('Minuto llegada de facturación a control'));

      let colMinutoLlegadaDeChequeoBilleteAControl: HTMLTableHeaderCellElement = subEncabezados.insertCell();
      colMinutoLlegadaDeChequeoBilleteAControl.style.fontWeight = "bold";
      colMinutoLlegadaDeChequeoBilleteAControl.style.color = "red";
      colMinutoLlegadaDeChequeoBilleteAControl.appendChild(document.createTextNode('Minuto llegada de chequeo a control'));

      let colMinutoLlegadaDeControlAEmbarque: HTMLTableHeaderCellElement = subEncabezados.insertCell();
      colMinutoLlegadaDeControlAEmbarque.style.fontWeight = "bold";
      colMinutoLlegadaDeControlAEmbarque.style.color = "red";
      colMinutoLlegadaDeControlAEmbarque.appendChild(document.createTextNode('Minuto llegada de control a embarque'));
    }
  } 
  
  // Completa los encabezados de la tabla con los datos de los pasajeros.
  export function completarEncabezadosDeTablaAlternativa(cantPasajeros: number, tabla: HTMLTableElement): void {
    let encabezados: HTMLTableRowElement = tabla.rows[0];
    let subEncabezados: HTMLTableRowElement = tabla.rows[1];
    for (let i: number = 0; i < cantPasajeros; i++) {
      let colPasajero: HTMLTableHeaderCellElement = encabezados.insertCell();
      colPasajero.colSpan = 7;
      colPasajero.style.fontWeight = "bold";
      colPasajero.appendChild(document.createTextNode('Pasajero N° ' + (i+1)));

      let colNroPasajero: HTMLTableHeaderCellElement = subEncabezados.insertCell();
      colNroPasajero.style.fontWeight = "bold";
      colNroPasajero.appendChild(document.createTextNode('ID Pasajero'));

      let colTipoPasajero: HTMLTableHeaderCellElement = subEncabezados.insertCell();
      colTipoPasajero.style.fontWeight = "bold";
      colTipoPasajero.appendChild(document.createTextNode('Tipo Pasajero'));
      
      let colEstadoPasajero: HTMLTableHeaderCellElement = subEncabezados.insertCell();
      colEstadoPasajero.style.fontWeight = "bold";
      colEstadoPasajero.appendChild(document.createTextNode('Estado'));

      let colMinutoLlegada: HTMLTableHeaderCellElement = subEncabezados.insertCell();
      colMinutoLlegada.style.fontWeight = "bold";
      colMinutoLlegada.appendChild(document.createTextNode('Minuto llegada'));

      let colMinutoLlegadaDeFacturacionAControl: HTMLTableHeaderCellElement = subEncabezados.insertCell();
      colMinutoLlegadaDeFacturacionAControl.style.fontWeight = "bold";
      colMinutoLlegadaDeFacturacionAControl.style.color = "red";
      colMinutoLlegadaDeFacturacionAControl.appendChild(document.createTextNode('Minuto llegada de venta-facturación a control'));

      let colMinutoLlegadaDeChequeoBilleteAControl: HTMLTableHeaderCellElement = subEncabezados.insertCell();
      colMinutoLlegadaDeChequeoBilleteAControl.style.fontWeight = "bold";
      colMinutoLlegadaDeChequeoBilleteAControl.style.color = "red";
      colMinutoLlegadaDeChequeoBilleteAControl.appendChild(document.createTextNode('Minuto llegada de chequeo a control'));

      let colMinutoLlegadaDeControlAEmbarque: HTMLTableHeaderCellElement = subEncabezados.insertCell();
      colMinutoLlegadaDeControlAEmbarque.style.fontWeight = "bold";
      colMinutoLlegadaDeControlAEmbarque.style.color = "red";
      colMinutoLlegadaDeControlAEmbarque.appendChild(document.createTextNode('Minuto llegada de control a embarque'));
    }
  }
}