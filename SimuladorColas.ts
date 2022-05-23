import { Empleado } from "./Empleado";
import { Evento } from "./Evento";

export class SimuladorColas {
  private mediaTiempoEntreLlegadas: number = 3.4474;
  private matrizEstado: any[][];

  private tipoPasajero: Map<string, number> = new Map<string, number>([
    ["A", 0.3],
    ["B", 0.45],
    ["C", 1]
  ]);

  public async simular(cantEventos: number, indiceDesde: number): void {
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
    let colaFacturacion: number = 0;

    // Empleado Venta de billetes.
    let empleadoVentaBillete = new Empleado();
    let colaVentaBillete: number = 0;

    // Empleado Chequeo de billetes.
    let empleadoChequeoBillete = new Empleado();
    let colaChequeoBillete: number = 0;

    // Agente control de metales.
    let empleadoControlMetales = new Empleado();
    let colaControlMetales: number = 0;

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

      // Llegada de pasajero.
      rndLlegada = Math.random();
      tiempoEntreLlegadas = this.getTiempoEntreLlegadas(rndLlegada);
      proximaLlegada = reloj + tiempoEntreLlegadas;

      // Inicio de simulación.
      if (i == 0) {
        tipoEvento = Evento.INICIO_SIMULACION;
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
        finChequeoBillete,

        rndControlMetales,
        tiempoControlMetales,
        finControlMetales,

        rndPaseEntreZonas,
        tiempoPaseEntreZonas,
        finPaseEntreZonas,

        

        );



      
    }
  }

  public getTiempoEntreLlegadas(rndLlegada: number): number {
    // Generamos el tiempo entre llegadas, que tiene distribución exponencial.
    return -this.mediaTiempoEntreLlegadas * Math.log(1 - rndLlegada);
  }


}


