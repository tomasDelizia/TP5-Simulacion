import { Empleado } from "./Empleado";
import { EstadoPasajero } from "./EstadoPasajero";
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

    // Pase entre zonas: Venta y facturación.
    let rndPaseEntreVentaYFacturacion: number = 0;
    let tiempoPaseEntreVentaYFacturacion: number = 0;
    let finPaseEntreVentaYFacturacion: number = 0;

    // Pase entre zonas: Facturación y control.
    let rndPaseEntreFacturacionYControl: number = 0;
    let tiempoPaseEntreFacturacionYControl: number = 0;
    let finPaseEntreFacturacionYControl: number = 0;

    // Pase entre zonas: Chequeo y control.
    let rndPaseEntreChequeoYControl: number = 0;
    let tiempoPaseEntreChequeoYControl: number = 0;
    let finPaseEntreChequeoYControl: number = 0;

    // Pase entre zonas: Control y embarque.
    let rndPaseEntreControlYEmbarque: number = 0;
    let tiempoPaseEntreControlYEmbarque: number = 0;
    let finPaseEntreControlYEmbarque: number = 0;

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

    // Pasajeros en el sistema.
    let pasajerosEnSistema: Pasajero[] = [];

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
          finPaseEntreVentaYFacturacion,
          finPaseEntreFacturacionYControl,
          finPaseEntreChequeoYControl,
          finPaseEntreControlYEmbarque,
        ];
        reloj = Math.min(...eventosCandidatos);
        tipoEvento = this.getSiguienteEvento(eventosCandidatos);
      }

      switch (tipoEvento) {
        // Inicio de la simulación.
        case Evento.INICIO_SIMULACION: {
          rndLlegada = Math.random();
          tiempoEntreLlegadas = this.getTiempoEntreLlegadas(rndLlegada);
          proximaLlegada = reloj + tiempoEntreLlegadas;
          break;
        }
        // Llegada de un pasajero.
        case Evento.LLEGADA_PASAJERO: {
          // Obtenemos el tipo de pasajero.
          let rndTipoPasajero: number = Math.random();
          let tipoPasajero: string = this.getTipoPasajero(rndTipoPasajero);
          totalPasajeros ++;

          // Generamos la llegada del próximo pasajero.
          rndLlegada = Math.random();
          tiempoEntreLlegadas = this.getTiempoEntreLlegadas(rndLlegada);
          proximaLlegada = reloj + tiempoEntreLlegadas;

          // Creamos el objeto pasajero.
          let pasajero: Pasajero = new Pasajero(
            totalPasajeros,
            tipoPasajero,
            reloj
          );

          pasajerosEnSistema.push(pasajero);

          switch (tipoPasajero) {
            // Llega un pasajero de tipo A. Va primero a la ventanilla de facturación de equipaje.
            case "A": {
              totalPasajerosA++;
              if (empleadoFacturacion.estaLibre()) {
                pasajero.facturandoEquipaje();
                empleadoFacturacion.ocupado();

                // Generamos el tiempo de facturación.
                rndFacturacion = Math.random();
                tiempoFacturacion = this.getTiempoFacturacion(rndFacturacion);
                finFacturacion = reloj + tiempoFacturacion;
              }
              else {
                pasajero.enEsperaFacturacion();
                colaFacturacion.push(pasajero);
              }
              break;
            }

            // Llega un pasajero de tipo B. Va primero a la ventanilla de venta de billetes.
            case "B": {
              totalPasajerosB++;
              if (empleadoVentaBillete.estaLibre()) {
                pasajero.comprandoBillete();
                empleadoVentaBillete.ocupado();

                // Generamos el tiempo de venta de billete.
                rndVentaBillete = Math.random();
                tiempoVentaBillete = this.getTiempoVentaBillete(rndVentaBillete);
                finVentaBillete = reloj + tiempoVentaBillete;
              }
              else {
                pasajero.enEsperaCompraBillete();
                colaVentaBillete.push(pasajero);
              }
              break;
            }

            // Llega un pasajero de tipo C. Va primero a la ventanilla de chequeo de billetes.
            case "C": {
              totalPasajerosC++;
              if (empleadoChequeoBillete.estaLibre()) {
                pasajero.chequeandoBillete();
                empleadoChequeoBillete.ocupado();

                // Generamos el tiempo de chequeo de billete.
                rnd1ChequeoBillete = Math.random();
                rnd1ChequeoBillete = Math.random();
                tiempoChequeoBillete = this.getTiempoChequeoBillete(rnd1ChequeoBillete, rnd2ChequeoBillete);
                finChequeoBillete = reloj + tiempoChequeoBillete;
              }
              else {
                pasajero.enEsperaChequeoBilletes();
                colaChequeoBillete.push(pasajero);
              }
              break;
            }
          }
          break;
        }

        // Fin de facturación de un pasajero.
        case Evento.FIN_FACTURACION: {
          // Se genera el tiempo que tardará el pasajero atendido en pasar a la zona de control de metales.
          rndPaseEntreFacturacionYControl = Math.random();
          tiempoPaseEntreFacturacionYControl = this.getTiempoPasoEntreZonas(rndPaseEntreFacturacionYControl);
          finPaseEntreFacturacionYControl = reloj + tiempoPaseEntreFacturacionYControl;
          // Buscamos el pasajero atendido y le cambiamos el estado.
          pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajero.FACTURANDO_EQUIPAJE).pasandoDeFacturacionAControl();

          // Preguntamos si hay alguien en la cola.
          if (colaFacturacion.length === 0) {
            empleadoFacturacion.libre();
          }
          else {
            empleadoFacturacion.ocupado();
            // Quitamos a un pasajero de la cola y cambiamos su estado.
            colaFacturacion.shift().facturandoEquipaje();
            // Generamos el tiempo de facturación.
            rndFacturacion = Math.random();
            tiempoFacturacion = this.getTiempoFacturacion(rndFacturacion);
            finFacturacion = reloj + tiempoFacturacion;
          }
          break;
        }

        // Fin de venta de billete a un pasajero.
        case Evento.FIN_VENTA_BILLETE: {
          // Se genera el tiempo que tardará el pasajero atendido en pasar a la ventanilla de facturación.
          rndPaseEntreVentaYFacturacion = Math.random();
          tiempoPaseEntreVentaYFacturacion = this.getTiempoPasoEntreZonas(rndPaseEntreVentaYFacturacion);
          finPaseEntreVentaYFacturacion = reloj + tiempoPaseEntreVentaYFacturacion;
          // Buscamos el pasajero atendido y le cambiamos el estado.
          pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajero.COMPRANDO_BILLETE).pasandoDeVentaAFacturacion();

          // Preguntamos si hay alguien en la cola.
          if (colaVentaBillete.length === 0) {
            empleadoVentaBillete.libre();
          }
          else {
            empleadoVentaBillete.ocupado();
            // Quitamos a un pasajero de la cola y cambiamos su estado.
            colaVentaBillete.shift().comprandoBillete();
            // Generamos el tiempo de venta de billete.
            rndVentaBillete = Math.random();
            tiempoVentaBillete = this.getTiempoVentaBillete(rndVentaBillete);
            finVentaBillete = reloj + tiempoVentaBillete;
          }
          break;
        }

        // Fin de chequeo de billete a un pasajero.
        case Evento.FIN_CHEQUEO_BILLETE: {
          // Se genera el tiempo que tardará el pasajero atendido en pasar a la zona de control de metales.
          rndPaseEntreChequeoYControl = Math.random();
          tiempoPaseEntreChequeoYControl = this.getTiempoPasoEntreZonas(rndPaseEntreChequeoYControl);
          finPaseEntreChequeoYControl = reloj + tiempoPaseEntreChequeoYControl;
          // Buscamos el pasajero atendido y le cambiamos el estado.
          pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajero.CHEQUEANDO_BILLETE).pasandoDeChequeoAControl();

          // Preguntamos si hay alguien en la cola.
          if (colaChequeoBillete.length === 0) {
            empleadoChequeoBillete.libre();
          }
          else {
            empleadoChequeoBillete.ocupado();
            // Quitamos a un pasajero de la cola y cambiamos su estado.
            colaChequeoBillete.shift().chequeandoBillete();
            // Generamos el tiempo de Chequeo de billete.
            rnd1ChequeoBillete = Math.random();
            rnd1ChequeoBillete = Math.random();
            tiempoChequeoBillete = this.getTiempoChequeoBillete(rnd1ChequeoBillete, rnd2ChequeoBillete);
            finChequeoBillete = reloj + tiempoChequeoBillete;
          }
          break;
        }

        // Fin de control de metales a un pasajero.
        case Evento.FIN_CONTROL_METALES: {
          // Se genera el tiempo que tardará el pasajero atendido en pasar a la zona de embarque.
          rndPaseEntreControlYEmbarque = Math.random();
          tiempoPaseEntreControlYEmbarque = this.getTiempoPasoEntreZonas(rndPaseEntreControlYEmbarque);
          finPaseEntreControlYEmbarque = reloj + tiempoPaseEntreControlYEmbarque;
          // Buscamos el pasajero atendido y le cambiamos el estado.
          pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajero.EN_CONTROL_METALES).pasandoDeControlAEmbarque();

          // Preguntamos si hay alguien en la cola.
          if (colaControlMetales.length === 0) {
            empleadoControlMetales.libre();
          }
          else {
            empleadoControlMetales.ocupado();
            // Quitamos a un pasajero de la cola y cambiamos su estado.
            colaControlMetales.shift().enControlMetales();
            rndControlMetales = Math.random();
            tiempoControlMetales = this.getTiempoControlMetales(rndControlMetales);
            finControlMetales = reloj + tiempoControlMetales;
          }
          break;
        }

        // Fin de paso entre zonas de un pasajero.
        case Evento.FIN_PASO_ENTRE_VENTA_Y_FACTURACION: {
          // Buscamos el pasajero que llegó a la zona de facturación y le cambiamos el estado. Antes, preguntamos por el servidor.
          let pasajero: Pasajero = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajero.PASANDO_DE_VENTA_A_FACTURACION);
          if (empleadoFacturacion.estaLibre()) {
            pasajero.facturandoEquipaje();
            empleadoFacturacion.ocupado();

            // Generamos el tiempo de facturación.
            rndFacturacion = Math.random();
            tiempoFacturacion = this.getTiempoFacturacion(rndFacturacion);
            finFacturacion = reloj + tiempoFacturacion;
          }
          else {
            pasajero.enEsperaFacturacion();
            colaFacturacion.push(pasajero);
          }
          break;
        }

        // Fin de paso entre zonas de un pasajero.
        case Evento.FIN_PASO_ENTRE_FACTURACION_Y_CONTROL: {
          // Buscamos el pasajero que llegó a la zona de control y le cambiamos el estado. Antes, preguntamos por el servidor.
          let pasajero: Pasajero = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajero.PASANDO_DE_FACTURACION_A_CONTROL);
          if (empleadoControlMetales.estaLibre()) {
            pasajero.enControlMetales();
            empleadoControlMetales.ocupado();

            // Generamos el tiempo de facturación.
            rndControlMetales = Math.random();
            tiempoControlMetales = this.getTiempoFacturacion(rndControlMetales);
            finControlMetales = reloj + tiempoControlMetales;
          }
          else {
            pasajero.enEsperaControlMetales();
            colaControlMetales.push(pasajero);
          }
          break;
        }

        // Fin de paso entre zonas de un pasajero.
        case Evento.FIN_PASO_ENTRE_CHEQUEO_Y_CONTROL: {
          // Buscamos el pasajero que llegó a la zona de control y le cambiamos el estado. Antes, preguntamos por el servidor.
          let pasajero: Pasajero = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajero.PASANDO_DE_CHEQUEO_BILLETE_A_CONTROL);
          if (empleadoControlMetales.estaLibre()) {
            pasajero.enControlMetales();
            empleadoControlMetales.ocupado();

            // Generamos el tiempo de facturación.
            rndControlMetales = Math.random();
            tiempoControlMetales = this.getTiempoFacturacion(rndControlMetales);
            finControlMetales = reloj + tiempoControlMetales;
          }
          else {
            pasajero.enEsperaControlMetales();
            colaControlMetales.push(pasajero);
          }
          break;
        }

        // Fin de paso entre zonas de un pasajero.
        case Evento.FIN_PASO_ENTRE_CONTROL_Y_EMBARQUE: {
          // Buscamos el pasajero que llegó a embarque y lo eliminamos del sistema.
          pasajerosEnSistema.splice(pasajerosEnSistema.findIndex(pasajero => pasajero.getEstado() === EstadoPasajero.PASANDO_DE_CONTROL_A_EMBARQUE));
          break;
        }

        // Fin de simulación.
        case Evento.FIN_SIMULACION: {
          break;
        }
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

        rndPaseEntreVentaYFacturacion,
        tiempoPaseEntreVentaYFacturacion,
        finPaseEntreVentaYFacturacion,

        rndPaseEntreFacturacionYControl,
        tiempoPaseEntreFacturacionYControl,
        finPaseEntreFacturacionYControl,

        rndPaseEntreChequeoYControl,
        tiempoPaseEntreChequeoYControl,
        finPaseEntreChequeoYControl,

        rndPaseEntreControlYEmbarque,
        tiempoPaseEntreControlYEmbarque,
        finPaseEntreControlYEmbarque,

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

      evento.concat(evento, pasajerosEnSistema);
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