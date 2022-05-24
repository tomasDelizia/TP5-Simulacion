import { Empleado } from "./Empleado";
import { Evento } from "./Evento";
import { Pasajero } from "./Pasajero";

export class SimuladorColas {
  private mediaTiempoEntreLlegadas: number = 3.4474;
  
  private aTiempoFacturacion: number = 2;
  private bTiempoFacturacion: number = 5;

  private mediaTiempoVentaBilletes: number = 6.858;

  private mediaTiempoChequeoBilletes: number = 1;
  private desviacionTiempoChequeoBilletes: number = 0.5;
  
  private mediaTiempoControlMetales: number = 2;

  private mediaTiempoPasoEntreZonas: number = 2;

  private matrizEstado: any[][];

  private tiposPasajeros: Map<string, number> = new Map<string, number>([
    ["A", 0.3],
    ["B", 0.45],
    ["C", 1]
  ]);

  private probTiposPasajeros: number[] = [0.3, 0.45, 1];

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
    let rnd1ChequeoBillete: number = 0;
    let rnd2ChequeoBillete: number = 0;
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
        let eventosCandidatos: number[] = [
          proximaLlegada,
          finFacturacion,
          finVentaBillete,
          finChequeoBillete,
          finControlMetales,
          finPaseEntreZonas
        ];
        reloj = Math.min(...eventosCandidatos);
        tipoEvento = this.getSiguienteEvento(eventosCandidatos);
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
          let rndTipoPasajero: number = Math.random();
          let tipoPasajero: string = this.getTipoPasajero(rndTipoPasajero);
          totalPasajeros ++;

          let pasajero: Pasajero = new Pasajero(
            totalPasajeros,
            tipoPasajero,
            reloj
          );

          switch (tipoPasajero) {
            case "A":
              totalPasajerosA++;
              if (empleadoFacturacion.estaLibre) {
                empleadoFacturacion.ocupado();

                rndFacturacion = Math.random();
                tiempoFacturacion = this.getTiempoFacturacion(rndFacturacion);
                finFacturacion = reloj + tiempoFacturacion;
              }
              else
                colaFacturacion.push(pasajero);
              break;
            case "B":
              totalPasajerosB++;
              rndVentaBillete = Math.random();
              tiempoVentaBillete = this.getTiempoVentaBillete(rndVentaBillete);
              finVentaBillete = reloj + tiempoVentaBillete;
              break;
            case "C":
              totalPasajerosC++;
              rnd1ChequeoBillete = Math.random();
              rnd1ChequeoBillete = Math.random();
              tiempoChequeoBillete = this.getTiempoChequeoBillete(rnd1ChequeoBillete, rnd2ChequeoBillete);
              finChequeoBillete = reloj + tiempoChequeoBillete;
              break;
          }



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

        rnd1ChequeoBillete,
        rnd2ChequeoBillete,
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

  public getSiguienteEvento(tiempoEventos: number[]): Evento {
    let menor: number = Math.min(...tiempoEventos);
    for (let i: number = 0; i < tiempoEventos.length; i++) {
      if (tiempoEventos[i] === menor)
        return Evento[Evento[i+1]];
    }
    return -1;
  }

  // Cálculo del tiempo entre llegadas, que tiene distribución exponencial.
  public getTiempoEntreLlegadas(rndLlegada: number): number {
    return -this.mediaTiempoEntreLlegadas * Math.log(1 - rndLlegada);
  }

  // Obtención del tipo de pasajero según la probabilidad asociada.
  public getTipoPasajero(probTipoPasajero: number): string {
    const tipos: string[] = ["A", "B", "C"];
    for (let i: number = 0; i < this.probTiposPasajeros.length; i++) {
      if (probTipoPasajero < this.probTiposPasajeros[i])
        return tipos[i];
    }
  }

  // Cálculo del tiempo de facturación, que tiene distribución uniforme.
  public getTiempoFacturacion(rndTiempoFacturacion: number): number {
    return this.aTiempoFacturacion + rndTiempoFacturacion * (this.bTiempoFacturacion - this.aTiempoFacturacion);
  }

  // Cálculo del tiempo de venta de billete, que tiene distribución exponencial.
  public getTiempoVentaBillete(rndTiempoVenta: number): number {
    return -this.mediaTiempoVentaBilletes * Math.log(1 - rndTiempoVenta);
  }

  // Cálculo del tiempo de chequeo de billete, que tiene distribución normal.
  public getTiempoChequeoBillete(rndTiempoChequeo1: number, rndTiempoChequeo2: number): number {
    return (Math.sqrt(-2 * Math.log(rndTiempoChequeo1)) * Math.cos(2 * Math.PI * rndTiempoChequeo2)) * this.desviacionTiempoChequeoBilletes + this.mediaTiempoChequeoBilletes;
  }

  // Cálculo del tiempo de chequeo de billete, que tiene distribución exponencial.
  public getTiempoControlMetales(rndTiempoControl: number): number {
    return -this.mediaTiempoControlMetales * Math.log(1 - rndTiempoControl);
  }

  // Cálculo del tiempo de paso entre zonas, que tiene distribución exponencial.
  public getTiempoPasoEntreZonas(rndPasoZonas: number): number {
    return -this.mediaTiempoPasoEntreZonas * Math.log(1 - rndPasoZonas);
  }
}