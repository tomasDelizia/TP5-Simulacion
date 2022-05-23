import { Empleado } from "./Empleado";
import { Evento } from "./Evento";
import { Pasajero } from "./Pasajero";

export class SimuladorColas {
  private mediaTiempoEntreLlegadas: number = 3.4474;
  private matrizEstado: any[][];

  private tipoPasajero: Map<string, number> = new Map<string, number>([
    ["A", 0.3],
    ["B", 0.45],
    ["C", 1]
  ]);

  public async simular(cantEventos: number, indiceDesde: number): Promise<void> {
    this.matrizEstado = [];

    // Definimos el rango de filas que vamos a mostrar.
    let indiceHasta: number = indiceDesde + 399;
    if (indiceHasta > cantEventos - 1)
      indiceHasta = cantEventos;

    // Vector de estado.
    let evento: any[] = [];

    let tipoEvento: Evento;
    let reloj: number = 0;

    // Llegada de un pasajero.
    let rndLlegada: number = 0;
    let tiempoEntreLlegadas: number = 0;
    let proximaLlegada: number = 0;

    // Facturación de pasajero.
    let rndFacturacion: number = 0;
    let tiempoFacturacion: number = 0;
    let finFacturacion: number = 0;

    // Venta billete.
    let rndVentaBillete: number = 0;
    let tiempoVentaBillete: number = 0;
    let finVentaBillete: number = 0;

    // Chequeo billete.
    let rndChequeoBillete: number = 0;
    let tiempoChequeoBillete: number = 0;
    let finChequeoBillete: number = 0;

    // Control de metales.
    let rndControlMetales: number = 0;
    let tiempoControlMetales: number = 0;
    let finControlMetales: number = 0;

    // Pase entre zonas.
    let rndPaseEntreZonas: number = 0;
    let tiempoPaseEntreZonas: number = 0;
    let finPaseEntreZonas: number = 0;

    // Empleado facturación.
    let empleadoFacturacion = new Empleado();
    let colaFacturacion: Pasajero[] = [];

    // Empleado Venta de billetes.
    let empleadoVentaBillete = new Empleado();
    let colaVentaBillete: Pasajero[] = [];

    // Empleado Chequeo de billetes.
    let empleadoChequeoBillete = new Empleado();
    let colaChequeoBillete: Pasajero[] = [];

    // Agente control de metales.
    let empleadoControlMetales = new Empleado();
    let colaControlMetales: Pasajero[] = [];

    // Métricas.
    let totalPasajerosA: number = 0;
    let totalPasajerosB: number = 0;
    let totalPasajerosC: number = 0;
    let totalPasajeros: number = 0;
    let acuTiempoPasajeros: number = 0;
    let acuTiempoOciosoFacturacion: number = 0;
    let cantPasajerosAtentidosPorVenta: number = 0;
    let cantMaxPasajerosEnCola: number = 0;
    let acuTiempoEsperaColaControl: number = 0;
    let totalPasajerosEnColaControl: number = 0;

    for (let i: number = 0; i < cantEventos; i++) {
      // Determinamos el tipo de evento.
      if (i == 0) {
        tipoEvento = Evento.INICIO_SIMULACION;
      }
      else if (i == cantEventos - 1) {
        tipoEvento = Evento.FIN_SIMULACION;
      }
      else {
        tipoEvento = this.getSiguienteEvento([
          proximaLlegada,
          finFacturacion,
          finVentaBillete,
          finChequeoBillete,
          finControlMetales,
          finPaseEntreZonas
        ]);
      }

      switch (tipoEvento) {
        // Inicio de la simulación.
        case Evento.INICIO_SIMULACION:
          rndLlegada = Math.random();
          tiempoEntreLlegadas = this.getTiempoEntreLlegadas(rndLlegada);
          proximaLlegada = reloj + tiempoEntreLlegadas;
          break;

        // Llegada de pasajero.
        case Evento.LLEGADA_PASAJERO:

          break;

        case Evento.FIN_FACTURACION:
          break;
        case Evento.FIN_VENTA_BILLETE:
          break;
        case Evento.FIN_CHEQUEO_BILLETE:
          break;
        case Evento.FIN_CONTROL_METALES:
          break;
        case Evento.FIN_PASO_ENTRE_ZONAS:
          break;
        case Evento.FIN_SIMULACION:
          break;  
      }

      evento.push(
        i,
        tipoEvento,
        reloj,

        rndLlegada,
        tiempoEntreLlegadas,
        proximaLlegada,

        rndFacturacion,
        tiempoFacturacion,
        finFacturacion,

        rndVentaBillete,
        tiempoVentaBillete,
        finVentaBillete,

        rndChequeoBillete,
        tiempoChequeoBillete,
        finChequeoBillete,

        rndControlMetales,
        tiempoControlMetales,
        finControlMetales,

        rndPaseEntreZonas,
        tiempoPaseEntreZonas,
        finPaseEntreZonas,

        empleadoFacturacion.getEstado(),
        colaFacturacion.length,

        empleadoVentaBillete.getEstado(),
        colaVentaBillete.length,

        empleadoChequeoBillete.getEstado(),
        colaChequeoBillete.length,

        empleadoControlMetales.getEstado(),
        colaControlMetales.length,

        totalPasajerosA,
        totalPasajerosB,
        totalPasajerosC,
        totalPasajeros,
        acuTiempoPasajeros,
        acuTiempoOciosoFacturacion,
        cantPasajerosAtentidosPorVenta,
        cantMaxPasajerosEnCola,
        acuTiempoEsperaColaControl,
        totalPasajerosEnColaControl
        );
    }

    this.matrizEstado.push(evento);
  }

  public getMatrizEstado(): any[][] {
    return this.matrizEstado;
  }

  public getTiempoEntreLlegadas(rndLlegada: number): number {
    // Generamos el tiempo entre llegadas, que tiene distribución exponencial.
    return -this.mediaTiempoEntreLlegadas * Math.log(1 - rndLlegada);
  }

  public getSiguienteEvento(tiempoEventos: number[]): Evento {
    let menor: number = Math.min(...tiempoEventos);
    for (let i: number = 0; i < tiempoEventos.length; i++) {
      if (tiempoEventos[i] === menor)
        return Evento[Evento[i+1]];
    }
    return -1;
  }
}