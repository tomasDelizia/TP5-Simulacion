import { Empleado } from "./Empleado";
import { EstadoPasajero } from "./EstadoPasajero";
import { Evento } from "./Evento";
import { Pasajero } from "./Pasajero";
import { Utils } from "./Utils";

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

  private cantMaxPasajeros;

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
    let rndLlegada: number;
    let tiempoEntreLlegadas: number;
    let proximaLlegada: number;
    let rndTipoPasajero: number;
    let tipoPasajero: string;

    // Facturación de pasajero.
    let rndFacturacion: number;
    let tiempoFacturacion: number;
    let finFacturacion: number;

    // Venta billete.
    let rndVentaBillete: number;
    let tiempoVentaBillete: number;
    let finVentaBillete: number;

    // Chequeo billete.
    let rnd1ChequeoBillete: number;
    let rnd2ChequeoBillete: number;
    let tiempoChequeoBillete: number;
    let finChequeoBillete: number;

    // Control de metales.
    let rndControlMetales: number;
    let tiempoControlMetales: number;
    let finControlMetales: number;

    // Pase entre zonas: Venta y facturación.
    let rndPaseEntreVentaYFacturacion: number;
    let tiempoPaseEntreVentaYFacturacion: number;
    let finPaseEntreVentaYFacturacion: number;

    // Pase entre zonas: Facturación y control.
    let rndPaseEntreFacturacionYControl: number;
    let tiempoPaseEntreFacturacionYControl: number;
    let finPaseEntreFacturacionYControl: number;

    // Pase entre zonas: Chequeo y control.
    let rndPaseEntreChequeoYControl: number;
    let tiempoPaseEntreChequeoYControl: number;
    let finPaseEntreChequeoYControl: number;

    // Pase entre zonas: Control y embarque.
    let rndPaseEntreControlYEmbarque: number;
    let tiempoPaseEntreControlYEmbarque: number;
    let finPaseEntreControlYEmbarque: number;

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

    this.cantMaxPasajeros = 0;

    for (let i: number = 0; i < cantEventos; i++) {
      evento = [];
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
          // finPaseEntreVentaYFacturacion,
          // finPaseEntreFacturacionYControl,
          // finPaseEntreChequeoYControl,
          // finPaseEntreControlYEmbarque,
        ];
        for (let i: number = 0; i < pasajerosEnSistema.length; i++) {
          let pasajero: Pasajero = pasajerosEnSistema[i];
          eventosCandidatos.push(
            pasajero.minutoLlegadaDeVentaAFacturacion,
            pasajero.minutoLlegadaDeFacturacionAControl,
            pasajero.minutoLlegadaDeChequeoBilleteAControl,
            pasajero.minutoLlegadaDeControlAEmbarque
          );
        }
        reloj = Utils.getMenorMayorACero(eventosCandidatos);
        tipoEvento = this.getSiguienteEvento(eventosCandidatos, reloj);
      }

      switch (tipoEvento) {
        // Inicio de la simulación.
        case Evento.INICIO_SIMULACION: {
          rndLlegada = Number(Math.random().toFixed(4));
          tiempoEntreLlegadas = this.getTiempoEntreLlegadas(rndLlegada);
          proximaLlegada = Number((reloj + tiempoEntreLlegadas).toFixed(4));
          break;
        }
        // Llegada de un pasajero.
        case Evento.LLEGADA_PASAJERO: {
          // Obtenemos el tipo de pasajero.
          rndTipoPasajero = Number(Math.random().toFixed(4));
          tipoPasajero = this.getTipoPasajero(rndTipoPasajero);
          totalPasajeros ++;

          // Generamos la llegada del próximo pasajero.
          rndLlegada = Number(Math.random().toFixed(4));
          tiempoEntreLlegadas = this.getTiempoEntreLlegadas(rndLlegada);
          proximaLlegada = Number((reloj + tiempoEntreLlegadas).toFixed(4));

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
                rndFacturacion = Number(Math.random().toFixed(4));
                tiempoFacturacion = this.getTiempoFacturacion(rndFacturacion);
                finFacturacion = Number((reloj + tiempoFacturacion).toFixed(4));
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
                rndVentaBillete = Number(Math.random().toFixed(4));
                tiempoVentaBillete = this.getTiempoVentaBillete(rndVentaBillete);
                finVentaBillete = Number((reloj + tiempoVentaBillete).toFixed(4));
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
                rnd1ChequeoBillete = Number(Math.random().toFixed(4));
                rnd2ChequeoBillete = Number(Math.random().toFixed(4));
                tiempoChequeoBillete = this.getTiempoChequeoBillete(rnd1ChequeoBillete, rnd2ChequeoBillete);
                finChequeoBillete = Number((reloj + tiempoChequeoBillete).toFixed(4));
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
          rndFacturacion = null;
          tiempoFacturacion = null;
          finFacturacion = null;
          // Se genera el tiempo que tardará el pasajero atendido en pasar a la zona de control de metales.
          rndPaseEntreFacturacionYControl = Number(Math.random().toFixed(4));
          tiempoPaseEntreFacturacionYControl = this.getTiempoPasoEntreZonas(rndPaseEntreFacturacionYControl);
          finPaseEntreFacturacionYControl = Number((reloj + tiempoPaseEntreFacturacionYControl).toFixed(4));
          // Buscamos el pasajero atendido y le cambiamos el estado.
          let pasajeroAtendido: Pasajero = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajero.FACTURANDO_EQUIPAJE);
          pasajeroAtendido.pasandoDeFacturacionAControl();
          pasajeroAtendido.minutoLlegadaDeFacturacionAControl = finPaseEntreFacturacionYControl;
          // Preguntamos si hay alguien en la cola.
          if (colaFacturacion.length === 0) {
            empleadoFacturacion.libre();
          }
          else {
            empleadoFacturacion.ocupado();
            // Quitamos a un pasajero de la cola y cambiamos su estado.
            colaFacturacion.shift().facturandoEquipaje();
            // Generamos el tiempo de facturación.
            rndFacturacion = Number(Math.random().toFixed(4));
            tiempoFacturacion = this.getTiempoFacturacion(rndFacturacion);
            finFacturacion = Number((reloj + tiempoFacturacion).toFixed(4));
          }
          break;
        }

        // Fin de venta de billete a un pasajero.
        case Evento.FIN_VENTA_BILLETE: {
          rndVentaBillete = null;
          tiempoVentaBillete = null;
          finVentaBillete = null;
          // Se genera el tiempo que tardará el pasajero atendido en pasar a la ventanilla de facturación.
          rndPaseEntreVentaYFacturacion = Number(Math.random().toFixed(4));
          tiempoPaseEntreVentaYFacturacion = this.getTiempoPasoEntreZonas(rndPaseEntreVentaYFacturacion);
          finPaseEntreVentaYFacturacion = Number((reloj + tiempoPaseEntreVentaYFacturacion).toFixed(4));
          // Buscamos el pasajero atendido y le cambiamos el estado.
          let pasajeroAtendido: Pasajero = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajero.COMPRANDO_BILLETE);
          pasajeroAtendido.pasandoDeVentaAFacturacion();
          pasajeroAtendido.minutoLlegadaDeVentaAFacturacion = finPaseEntreVentaYFacturacion;
          // Preguntamos si hay alguien en la cola.
          if (colaVentaBillete.length === 0) {
            empleadoVentaBillete.libre();
          }
          else {
            empleadoVentaBillete.ocupado();
            // Quitamos a un pasajero de la cola y cambiamos su estado.
            colaVentaBillete.shift().comprandoBillete();
            // Generamos el tiempo de venta de billete.
            rndVentaBillete = Number(Math.random().toFixed(4));
            tiempoVentaBillete = this.getTiempoVentaBillete(rndVentaBillete);
            finVentaBillete = Number((reloj + tiempoVentaBillete).toFixed(4));
          }
          break;
        }

        // Fin de chequeo de billete a un pasajero.
        case Evento.FIN_CHEQUEO_BILLETE: {
          rnd1ChequeoBillete = null;
          rnd2ChequeoBillete = null;
          tiempoChequeoBillete = null;
          finChequeoBillete = null;
          // Se genera el tiempo que tardará el pasajero atendido en pasar a la zona de control de metales.
          rndPaseEntreChequeoYControl = Number(Math.random().toFixed(4));
          tiempoPaseEntreChequeoYControl = this.getTiempoPasoEntreZonas(rndPaseEntreChequeoYControl);
          finPaseEntreChequeoYControl = Number((reloj + tiempoPaseEntreChequeoYControl).toFixed(4));
          // Buscamos el pasajero atendido y le cambiamos el estado.
          let pasajeroAtendido: Pasajero = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajero.CHEQUEANDO_BILLETE);
          pasajeroAtendido.pasandoDeChequeoAControl();
          console.log(pasajerosEnSistema)
          pasajeroAtendido.minutoLlegadaDeChequeoBilleteAControl = finPaseEntreChequeoYControl;

          // Preguntamos si hay alguien en la cola.
          if (colaChequeoBillete.length === 0) {
            empleadoChequeoBillete.libre();
          }
          else {
            empleadoChequeoBillete.ocupado();
            // Quitamos a un pasajero de la cola y cambiamos su estado.
            colaChequeoBillete.shift().chequeandoBillete();
            // Generamos el tiempo de Chequeo de billete.
            rnd1ChequeoBillete = Number(Math.random().toFixed(4));
            rnd2ChequeoBillete = Number(Math.random().toFixed(4));
            tiempoChequeoBillete = this.getTiempoChequeoBillete(rnd1ChequeoBillete, rnd2ChequeoBillete);
            finChequeoBillete = Number((reloj + tiempoChequeoBillete).toFixed(4));
          }
          break;
        }

        // Fin de control de metales a un pasajero.
        case Evento.FIN_CONTROL_METALES: {
          rndControlMetales = null;
          tiempoControlMetales = null;
          finControlMetales = null;
          // Se genera el tiempo que tardará el pasajero atendido en pasar a la zona de embarque.
          rndPaseEntreControlYEmbarque = Number(Math.random().toFixed(4));
          tiempoPaseEntreControlYEmbarque = this.getTiempoPasoEntreZonas(rndPaseEntreControlYEmbarque);
          finPaseEntreControlYEmbarque = Number((reloj + tiempoPaseEntreControlYEmbarque).toFixed(4));
          // Buscamos el pasajero atendido y le cambiamos el estado.
          let pasajeroAtendido: Pasajero = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajero.EN_CONTROL_METALES);
          pasajeroAtendido.pasandoDeControlAEmbarque();
          pasajeroAtendido.minutoLlegadaDeControlAEmbarque = finPaseEntreControlYEmbarque;

          // Preguntamos si hay alguien en la cola.
          if (colaControlMetales.length === 0) {
            empleadoControlMetales.libre();
          }
          else {
            empleadoControlMetales.ocupado();
            // Quitamos a un pasajero de la cola y cambiamos su estado.
            colaControlMetales.shift().enControlMetales();
            rndControlMetales = Number(Math.random().toFixed(4));
            tiempoControlMetales = this.getTiempoControlMetales(rndControlMetales);
            finControlMetales = Number((reloj + tiempoControlMetales).toFixed(4));
          }
          break;
        }

        // Fin de paso entre zonas de un pasajero.
        case Evento.FIN_PASO_ENTRE_VENTA_Y_FACTURACION: {
          rndPaseEntreVentaYFacturacion = null;
          tiempoPaseEntreVentaYFacturacion = null;
          finPaseEntreVentaYFacturacion = null;
          // Buscamos el pasajero que llegó a la zona de facturación y le cambiamos el estado. Antes, preguntamos por el servidor.
          let pasajero: Pasajero = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajero.PASANDO_DE_VENTA_A_FACTURACION && pasajero.minutoLlegadaDeVentaAFacturacion === reloj);
          pasajero.minutoLlegadaDeVentaAFacturacion = null;
          if (empleadoFacturacion.estaLibre()) {
            pasajero.facturandoEquipaje();
            empleadoFacturacion.ocupado();

            // Generamos el tiempo de facturación.
            rndFacturacion = Number(Math.random().toFixed(4));
            tiempoFacturacion = this.getTiempoFacturacion(rndFacturacion);
            finFacturacion = Number((reloj + tiempoFacturacion).toFixed(4));
          }
          else {
            pasajero.enEsperaFacturacion();
            colaFacturacion.push(pasajero);
          }
          break;
        }

        // Fin de paso entre zonas de un pasajero.
        case Evento.FIN_PASO_ENTRE_FACTURACION_Y_CONTROL: {
          rndPaseEntreFacturacionYControl = null;
          tiempoPaseEntreFacturacionYControl = null;
          finPaseEntreFacturacionYControl = null;
          // Buscamos el pasajero que llegó a la zona de control y le cambiamos el estado. Antes, preguntamos por el servidor.
          let pasajero: Pasajero = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajero.PASANDO_DE_FACTURACION_A_CONTROL && pasajero.minutoLlegadaDeFacturacionAControl === reloj);
          pasajero.minutoLlegadaDeFacturacionAControl = null;
          if (empleadoControlMetales.estaLibre()) {
            pasajero.enControlMetales();
            empleadoControlMetales.ocupado();

            // Generamos el tiempo de facturación.
            rndControlMetales = Number(Math.random().toFixed(4));
            tiempoControlMetales = this.getTiempoFacturacion(rndControlMetales);
            finControlMetales = Number((reloj + tiempoControlMetales).toFixed(4));
          }
          else {
            pasajero.enEsperaControlMetales();
            colaControlMetales.push(pasajero);
          }
          break;
        }

        // Fin de paso entre zonas de un pasajero.
        case Evento.FIN_PASO_ENTRE_CHEQUEO_Y_CONTROL: {
          console.log(pasajerosEnSistema)
          rndPaseEntreChequeoYControl = null;
          tiempoPaseEntreChequeoYControl = null;
          finPaseEntreChequeoYControl = null;
          // Buscamos el pasajero que llegó a la zona de control y le cambiamos el estado. Antes, preguntamos por el servidor.
          let pasajero: Pasajero = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajero.PASANDO_DE_CHEQUEO_BILLETE_A_CONTROL && pasajero.minutoLlegadaDeChequeoBilleteAControl === reloj);
          pasajero.minutoLlegadaDeChequeoBilleteAControl = null;
          if (empleadoControlMetales.estaLibre()) {
            pasajero.enControlMetales();
            empleadoControlMetales.ocupado();

            // Generamos el tiempo de facturación.
            rndControlMetales = Number(Math.random().toFixed(4));
            tiempoControlMetales = this.getTiempoFacturacion(rndControlMetales);
            finControlMetales = Number((reloj + tiempoControlMetales).toFixed(4));
          }
          else {
            pasajero.enEsperaControlMetales();
            colaControlMetales.push(pasajero);
          }
          break;
        }

        // Fin de paso entre zonas de un pasajero.
        case Evento.FIN_PASO_ENTRE_CONTROL_Y_EMBARQUE: {
          rndPaseEntreControlYEmbarque = null;
          tiempoPaseEntreControlYEmbarque = null;
          finPaseEntreControlYEmbarque = null;
          // Buscamos el pasajero que llegó a embarque y lo eliminamos del sistema.
          pasajerosEnSistema.splice(pasajerosEnSistema.findIndex(pasajero => pasajero.getEstado() === EstadoPasajero.PASANDO_DE_CONTROL_A_EMBARQUE && pasajero.minutoLlegadaDeControlAEmbarque === reloj), 1);
          break;
        }

        // Fin de simulación.
        case Evento.FIN_SIMULACION: {
          break;
        }
      }

      evento.push(
        i,
        Evento[tipoEvento],
        reloj,

        rndLlegada,
        tiempoEntreLlegadas,
        proximaLlegada,
        rndTipoPasajero,
        tipoPasajero,

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

        for (let i: number = 0; i < pasajerosEnSistema.length; i++) {
          evento.push(
            pasajerosEnSistema[i].getId(),
            pasajerosEnSistema[i].getTipoPasajero(),
            EstadoPasajero[pasajerosEnSistema[i].getEstado()],
            pasajerosEnSistema[i].getMinutoLlegada(),
            pasajerosEnSistema[i].minutoLlegadaDeVentaAFacturacion,
            pasajerosEnSistema[i].minutoLlegadaDeFacturacionAControl,
            pasajerosEnSistema[i].minutoLlegadaDeChequeoBilleteAControl,
            pasajerosEnSistema[i].minutoLlegadaDeControlAEmbarque,
            );
        }

        if (pasajerosEnSistema.length > this.cantMaxPasajeros)
          this.cantMaxPasajeros = pasajerosEnSistema.length;
       
        rndTipoPasajero = null;
        tipoPasajero = "";

        // Agregamos el evento a la matriz de estado.
        this.matrizEstado.push(evento);
    }
    
  }

  public getMatrizEstado(): any[][] {
    return this.matrizEstado;
  }

  public getSiguienteEvento(tiemposEventos: number[], relojActual: number): Evento {
    let menor: number = Utils.getMenorMayorACero(tiemposEventos);
    for (let i: number = 0; i < tiemposEventos.length; i++) {
      if (tiemposEventos[i] === menor) {
        if (i < 5)
          return Evento[Evento[i+1]];
        if (tiemposEventos[i] >= relojActual) {
          switch (i % 4) {
            case 0: {
              return Evento.FIN_PASO_ENTRE_CONTROL_Y_EMBARQUE;
            }
            case 1: {
              return Evento.FIN_PASO_ENTRE_VENTA_Y_FACTURACION;
            }
            case 2: {
              return Evento.FIN_PASO_ENTRE_FACTURACION_Y_CONTROL;
            }
            case 3: {
              return Evento.FIN_PASO_ENTRE_CHEQUEO_Y_CONTROL;
            }
          }
        }
      }
    }
    return -1;
  }

  // Cálculo del tiempo entre llegadas, que tiene distribución exponencial.
  public getTiempoEntreLlegadas(rndLlegada: number): number {
    let tiempo: number = -this.mediaTiempoEntreLlegadas * Math.log(1 - rndLlegada);
    return Number(tiempo.toFixed(4));
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
    let tiempo: number = this.aTiempoFacturacion + rndTiempoFacturacion * (this.bTiempoFacturacion - this.aTiempoFacturacion);
    return Number(tiempo.toFixed(4));
  }

  // Cálculo del tiempo de venta de billete, que tiene distribución exponencial.
  public getTiempoVentaBillete(rndTiempoVenta: number): number {
    let tiempo: number = -this.mediaTiempoVentaBilletes * Math.log(1 - rndTiempoVenta);
    return Number(tiempo.toFixed(4));
  }

  // Cálculo del tiempo de chequeo de billete, que tiene distribución normal.
  public getTiempoChequeoBillete(rndTiempoChequeo1: number, rndTiempoChequeo2: number): number {
    let tiempo: number = (Math.sqrt(-2 * Math.log(rndTiempoChequeo1)) * Math.cos(2 * Math.PI * rndTiempoChequeo2)) * this.desviacionTiempoChequeoBilletes + this.mediaTiempoChequeoBilletes;
    return Number(Math.abs(tiempo).toFixed(4));
  }

  // Cálculo del tiempo de chequeo de billete, que tiene distribución exponencial.
  public getTiempoControlMetales(rndTiempoControl: number): number {
    let tiempo: number = -this.mediaTiempoControlMetales * Math.log(1 - rndTiempoControl);
    return Number(tiempo.toFixed(4));
  }

  // Cálculo del tiempo de paso entre zonas, que tiene distribución exponencial.
  public getTiempoPasoEntreZonas(rndPasoZonas: number): number {
    let tiempo: number = -this.mediaTiempoPasoEntreZonas * Math.log(1 - rndPasoZonas);
    return Number(tiempo.toFixed(4));
  }

  public getCantMaxPasajerosEnSistema(): number {
    return this.cantMaxPasajeros;
  }
}