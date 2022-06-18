import { Empleado } from "./Empleado";
import { EstadoPasajeroAlt } from "./EstadoPasajeroAlt";
import { EventoAlt } from "./EventoAlt";
import { PasajeroAlt } from "./PasajeroAlt";
import { Simulador } from "./Simulador";
import { Utils } from "./Utils";

export class SimuladorColasAlternativo extends Simulador {

  public simular(cantEventos: number, eventoDesde: number): void {
    this.probTiposPasajeros = [0.45, 1];
    this.matrizEstado = [];

    // Definimos el rango de filas que vamos a mostrar.
    let indiceHasta: number = eventoDesde + 399;
    if (indiceHasta > cantEventos - 1)
      indiceHasta = cantEventos;

    // Vector de estado.
    let evento: string[] = [];

    let tipoEvento: EventoAlt;
    let reloj: number = 0;

    // Llegada de un pasajero.
    let rndLlegada: number = -1;
    let tiempoEntreLlegadas: number = -1;
    let proximaLlegada: number = -1;
    let rndTipoPasajero: number = -1;
    let tipoPasajero: string = '';

    // Facturación y venta de pasajero.
    let rndVentaFacturacion: number = -1;
    let tiempoVentaFacturacion: number = -1;
    let finVentaFacturacionEmp1: number = -1;
    let finVentaFacturacionEmp2: number = -1;

    // Chequeo billete.
    let rnd1ChequeoBillete: number = -1;
    let rnd2ChequeoBillete: number = -1;
    let tiempoChequeoBillete: number = -1;
    let finChequeoBillete: number = -1;

    // Control de metales.
    let rndControlMetales: number = -1;
    let tiempoControlMetales: number = -1;
    let finControlMetales: number = -1;

    // Pase entre zonas: Venta-facturación y control.
    let rndPaseEntreVentaFacturacionYControl: number = -1;
    let tiempoPaseEntreVentaFacturacionYControl: number = -1;
    let finPaseEntreVentaFacturacionYControl: number = -1;

    // Pase entre zonas: Chequeo y control.
    let rndPaseEntreChequeoYControl: number = -1;
    let tiempoPaseEntreChequeoYControl: number = -1;
    let finPaseEntreChequeoYControl: number = -1;

    // Pase entre zonas: Control y embarque.
    let rndPaseEntreControlYEmbarque: number = -1;
    let tiempoPaseEntreControlYEmbarque: number = -1;
    let finPaseEntreControlYEmbarque: number = -1;

    // Empleados de venta-facturación.
    let empleado1VentaFacturacion = new Empleado();
    let empleado2VentaFacturacion = new Empleado();
    let colaVentaFacturacion: PasajeroAlt[] = [];

    // Empleado Chequeo de billetes.
    let empleadoChequeoBillete = new Empleado();
    let colaChequeoBillete: PasajeroAlt[] = [];

    // Agente control de metales.
    let empleadoControlMetales = new Empleado();
    let colaControlMetales: PasajeroAlt[] = [];

    // Pasajeros en el sistema.
    let pasajerosEnSistema: PasajeroAlt[] = [];

    // Métricas.
    let totalPasajerosA: number = 0;
    let totalPasajerosB: number = 0;
    let totalPasajerosC: number = 0;
    let totalPasajeros: number = 0;
    let acuTiempoPasajeros: number = 0;
    let minutoTiempoOciosoEmpControlDesde: number = 0;
    let acuTiempoOciosoEmpControl: number = 0;
    let cantPasajerosAtentidosPorVentaFacturacion: number = 0;
    let cantMaxPasajerosEnAlgunaCola: number = 0;
    let cantMaxPasajerosEnColaControl: number = 0;

    this.cantMaxPasajeros = 0;

    for (let i: number = 0; i < cantEventos; i++) {
      evento = [];
      // Determinamos el tipo de evento.
      if (i == 0) {
        tipoEvento = EventoAlt.INICIO_SIMULACION;
      }
      else if (i == cantEventos - 1) {
        tipoEvento = EventoAlt.FIN_SIMULACION;
      }
      else {
        let eventosCandidatos: number[] = [
          proximaLlegada,
          finVentaFacturacionEmp1,
          finVentaFacturacionEmp2,
          finChequeoBillete,
          finControlMetales,
        ];
        for (let i: number = 0; i < pasajerosEnSistema.length; i++) {
          let pasajero: PasajeroAlt = pasajerosEnSistema[i];
          eventosCandidatos.push(
            pasajero.minutoLlegadaDeVentaFacturacionAControl,
            pasajero.minutoLlegadaDeChequeoBilleteAControl,
            pasajero.minutoLlegadaDeControlAEmbarque
          );
        }
        reloj = Number(Utils.getMenorMayorACero(eventosCandidatos).toFixed(4));
        tipoEvento = this.getSiguienteEvento(eventosCandidatos);
      }

      switch (tipoEvento) {
        // Inicio de la simulación.
        case EventoAlt.INICIO_SIMULACION: {
          rndLlegada = Number(Math.random().toFixed(4));
          tiempoEntreLlegadas = Number(this.getTiempoEntreLlegadas(rndLlegada).toFixed(4));
          proximaLlegada = Number((reloj + tiempoEntreLlegadas).toFixed(4));
          break;
        }
        // Llegada de un pasajero.
        case EventoAlt.LLEGADA_PASAJERO: {
          // Obtenemos el tipo de pasajero.
          rndTipoPasajero = Number(Math.random().toFixed(4));
          tipoPasajero = this.getTipoPasajero(rndTipoPasajero, ["AB", "C"]);
          totalPasajeros ++;

          // Generamos la llegada del próximo pasajero.
          rndLlegada = Number(Math.random().toFixed(4));
          tiempoEntreLlegadas = Number(this.getTiempoEntreLlegadas(rndLlegada).toFixed(4));
          proximaLlegada = Number((reloj + tiempoEntreLlegadas).toFixed(4));

          // Creamos el objeto pasajero.
          let pasajero: PasajeroAlt = new PasajeroAlt(
            totalPasajeros,
            tipoPasajero,
            reloj
          );

          pasajerosEnSistema.push(pasajero);

          switch (tipoPasajero) {
            // Llega un pasajero de tipo AB. Va primero a la ventanilla de Venta-facturación de equipaje.
            case "AB": {
              totalPasajerosA++;
              totalPasajerosB++;
              if (empleado1VentaFacturacion.estaLibre()) {
                pasajero.enVentaFacturacionEquipajeEmp1();
                empleado1VentaFacturacion.ocupado();

                // Generamos el tiempo de facturación.
                rndVentaFacturacion = Number(Math.random().toFixed(4));
                tiempoVentaFacturacion = Number(this.getTiempoVentaFacturacion(rndVentaFacturacion).toFixed(4));
                finVentaFacturacionEmp1 = Number((reloj + tiempoVentaFacturacion).toFixed(4));
              }
              else if (empleado2VentaFacturacion.estaLibre()) {
                pasajero.enVentaFacturacionEquipajeEmp2();
                empleado2VentaFacturacion.ocupado();

                // Generamos el tiempo de facturación.
                rndVentaFacturacion = Number(Math.random().toFixed(4));
                tiempoVentaFacturacion = Number(this.getTiempoVentaFacturacion(rndVentaFacturacion).toFixed(4));
                finVentaFacturacionEmp2 = Number((reloj + tiempoVentaFacturacion).toFixed(4));
              }
              else {
                pasajero.enEsperaVentaFacturacion();
                colaVentaFacturacion.push(pasajero);
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
                tiempoChequeoBillete = Number(this.getTiempoChequeoBillete(rnd1ChequeoBillete, rnd2ChequeoBillete).toFixed(4));
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

        // Fin de facturación-venta de un pasajero atendido por el empleado 1.
        case EventoAlt.FIN_FACTURACION_VENTA_EMP_1: {
          finVentaFacturacionEmp1 = -1;
          // Se genera el tiempo que tardará el pasajero atendido en pasar a la zona de control de metales.
          rndPaseEntreVentaFacturacionYControl = Number(Math.random().toFixed(4));
          tiempoPaseEntreVentaFacturacionYControl = Number(this.getTiempoPasoEntreZonas(rndPaseEntreVentaFacturacionYControl).toFixed(4));
          finPaseEntreVentaFacturacionYControl = Number((reloj + tiempoPaseEntreVentaFacturacionYControl).toFixed(4));
          // Buscamos el pasajero atendido y le cambiamos el estado.
          let pasajeroAtendido: PasajeroAlt = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajeroAlt.EN_VENTA_FACTURACION_EMP_1);
          pasajeroAtendido.pasandoDeVentaFacturacionAControl();
          pasajeroAtendido.minutoLlegadaDeVentaFacturacionAControl = finPaseEntreVentaFacturacionYControl;
          // Preguntamos si hay alguien en la cola.
          if (colaVentaFacturacion.length === 0) {
            empleado1VentaFacturacion.libre();
          }
          else {
            // El servidor pasa de ocupado a ocupado.
            empleado1VentaFacturacion.ocupado();

            // Quitamos a un pasajero de la cola y cambiamos su estado.
            colaVentaFacturacion.shift().enVentaFacturacionEquipajeEmp1();
            // Generamos el tiempo de facturación.
            rndVentaFacturacion = Number(Math.random().toFixed(4));
            tiempoVentaFacturacion = Number(this.getTiempoVentaFacturacion(rndVentaFacturacion).toFixed(4));
            finVentaFacturacionEmp1 = Number((reloj + tiempoVentaFacturacion).toFixed(4));
          }
          break;
        }

        // Fin de facturación-venta de un pasajero atendido por el empleado 2.
        case EventoAlt.FIN_FACTURACION_VENTA_EMP_2: {
          finVentaFacturacionEmp2 = -1;
          // Se genera el tiempo que tardará el pasajero atendido en pasar a la zona de control de metales.
          rndPaseEntreVentaFacturacionYControl = Number(Math.random().toFixed(4));
          tiempoPaseEntreVentaFacturacionYControl = Number(this.getTiempoPasoEntreZonas(rndPaseEntreVentaFacturacionYControl).toFixed(4));
          finPaseEntreVentaFacturacionYControl = Number((reloj + tiempoPaseEntreVentaFacturacionYControl).toFixed(4));
          // Buscamos el pasajero atendido y le cambiamos el estado.
          let pasajeroAtendido: PasajeroAlt = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajeroAlt.EN_VENTA_FACTURACION_EMP_2);
          pasajeroAtendido.pasandoDeVentaFacturacionAControl();
          pasajeroAtendido.minutoLlegadaDeVentaFacturacionAControl = finPaseEntreVentaFacturacionYControl;
          // Preguntamos si hay alguien en la cola.
          if (colaVentaFacturacion.length === 0) {
            empleado1VentaFacturacion.libre();
          }
          else {
            // El servidor pasa de ocupado a ocupado.
            empleado1VentaFacturacion.ocupado();

            // Quitamos a un pasajero de la cola y cambiamos su estado.
            colaVentaFacturacion.shift().enVentaFacturacionEquipajeEmp2();
            // Generamos el tiempo de facturación.
            rndVentaFacturacion = Number(Math.random().toFixed(4));
            tiempoVentaFacturacion = Number(this.getTiempoVentaFacturacion(rndVentaFacturacion).toFixed(4));
            finVentaFacturacionEmp2 = Number((reloj + tiempoVentaFacturacion).toFixed(4));
          }
          break;
        }

        // Fin de chequeo de billete a un pasajero.
        case EventoAlt.FIN_CHEQUEO_BILLETE: {
          finChequeoBillete = -1;
          // Se genera el tiempo que tardará el pasajero atendido en pasar a la zona de control de metales.
          rndPaseEntreChequeoYControl = Number(Math.random().toFixed(4));
          tiempoPaseEntreChequeoYControl = Number(this.getTiempoPasoEntreZonas(rndPaseEntreChequeoYControl).toFixed(4));
          finPaseEntreChequeoYControl = Number((reloj + tiempoPaseEntreChequeoYControl).toFixed(4));
          // Buscamos el pasajero atendido y le cambiamos el estado.
          let pasajeroAtendido: PasajeroAlt = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajeroAlt.CHEQUEANDO_BILLETE);
          pasajeroAtendido.pasandoDeChequeoAControl();
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
            tiempoChequeoBillete = Number(this.getTiempoChequeoBillete(rnd1ChequeoBillete, rnd2ChequeoBillete).toFixed(4));
            finChequeoBillete = Number((reloj + tiempoChequeoBillete).toFixed(4));
          }
          break;
        }

        // Fin de control de metales a un pasajero.
        case EventoAlt.FIN_CONTROL_METALES: {
          finControlMetales = -1;
          // Se genera el tiempo que tardará el pasajero atendido en pasar a la zona de embarque.
          rndPaseEntreControlYEmbarque = Number(Math.random().toFixed(4));
          tiempoPaseEntreControlYEmbarque = Number(this.getTiempoPasoEntreZonas(rndPaseEntreControlYEmbarque).toFixed(4));
          finPaseEntreControlYEmbarque = Number((reloj + tiempoPaseEntreControlYEmbarque).toFixed(4));
          // Buscamos el pasajero atendido y le cambiamos el estado.
          let pasajeroAtendido: PasajeroAlt = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajeroAlt.EN_CONTROL_METALES);
          pasajeroAtendido.pasandoDeControlAEmbarque();
          pasajeroAtendido.minutoLlegadaDeControlAEmbarque = finPaseEntreControlYEmbarque;

          // Preguntamos si hay alguien en la cola.
          if (colaControlMetales.length === 0) {
            empleadoControlMetales.libre();
            minutoTiempoOciosoEmpControlDesde = reloj;
          }
          else {
            // El servidor pasa de ocupado a ocupado.
            empleadoControlMetales.ocupado();
            // Quitamos a un pasajero de la cola y cambiamos su estado.
            colaControlMetales.shift().enControlMetales();
            rndControlMetales = Number(Math.random().toFixed(4));
            tiempoControlMetales = Number(this.getTiempoControlMetales(rndControlMetales).toFixed(4));
            finControlMetales = Number((reloj + tiempoControlMetales).toFixed(4));
          }
          break;
        }

        // Fin de paso entre zonas de un pasajero.
        case EventoAlt.FIN_PASO_ENTRE_VENTA_FACTURACION_Y_CONTROL: {
          finPaseEntreVentaFacturacionYControl = -1;
          // Buscamos el pasajero que llegó a la zona de control y le cambiamos el estado. Antes, preguntamos por el servidor.
          let pasajero: PasajeroAlt = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajeroAlt.PASANDO_DE_VENTA_FACTURACION_A_CONTROL && pasajero.minutoLlegadaDeVentaFacturacionAControl === reloj);
          pasajero.minutoLlegadaDeVentaFacturacionAControl = null;
          if (empleadoControlMetales.estaLibre()) {
            pasajero.enControlMetales();
            empleadoControlMetales.ocupado();
            acuTiempoOciosoEmpControl += reloj - minutoTiempoOciosoEmpControlDesde;

            // Generamos el tiempo de facturación.
            rndControlMetales = Number(Math.random().toFixed(4));
            tiempoControlMetales = Number(this.getTiempoVentaFacturacion(rndControlMetales).toFixed(4));
            finControlMetales = Number((reloj + tiempoControlMetales).toFixed(4));
          }
          else {
            pasajero.enEsperaControlMetales();
            colaControlMetales.push(pasajero);

          }
          break;
        }

        // Fin de paso entre zonas de un pasajero.
        case EventoAlt.FIN_PASO_ENTRE_CHEQUEO_Y_CONTROL: {
          finPaseEntreChequeoYControl = -1;
          // Buscamos el pasajero que llegó a la zona de control y le cambiamos el estado. Antes, preguntamos por el servidor.
          let pasajero: PasajeroAlt = pasajerosEnSistema.find(pasajero => pasajero.getEstado() === EstadoPasajeroAlt.PASANDO_DE_CHEQUEO_BILLETE_A_CONTROL && pasajero.minutoLlegadaDeChequeoBilleteAControl === reloj);
          pasajero.minutoLlegadaDeChequeoBilleteAControl = null;
          if (empleadoControlMetales.estaLibre()) {
            pasajero.enControlMetales();
            empleadoControlMetales.ocupado();
            acuTiempoOciosoEmpControl += reloj - minutoTiempoOciosoEmpControlDesde;

            // Generamos el tiempo de facturación.
            rndControlMetales = Number(Math.random().toFixed(4));
            tiempoControlMetales = Number(this.getTiempoVentaFacturacion(rndControlMetales).toFixed(4));
            finControlMetales = Number((reloj + tiempoControlMetales).toFixed(4));
          }
          else {
            pasajero.enEsperaControlMetales();
            colaControlMetales.push(pasajero);
          }
          break;
        }

        // Fin de paso entre zonas de un pasajero.
        case EventoAlt.FIN_PASO_ENTRE_CONTROL_Y_EMBARQUE: {
          finPaseEntreControlYEmbarque = -1;
          // Buscamos el pasajero que llegó a embarque y lo eliminamos del sistema.
          let indicePasajero: number = pasajerosEnSistema.findIndex(pasajero => pasajero.getEstado() === EstadoPasajeroAlt.PASANDO_DE_CONTROL_A_EMBARQUE && pasajero.minutoLlegadaDeControlAEmbarque === reloj);
          let pasajeroFinalizado: PasajeroAlt = pasajerosEnSistema[indicePasajero];
          // Calculamos el tiempo de permanencia.
          let tiempoPermanencia: number = reloj - pasajeroFinalizado.getMinutoLlegada();
          acuTiempoPasajeros += tiempoPermanencia;
          pasajerosEnSistema.splice(indicePasajero, 1);
          break;
        }

        // Fin de simulación.
        case EventoAlt.FIN_SIMULACION: {
          // Calculamos el tiempo de permanencia en el sistema de los pasajeros que quedaron en el sistema.
          for (let i: number = 0; i < pasajerosEnSistema.length; i++) {
            acuTiempoPasajeros += reloj - pasajerosEnSistema[i].getMinutoLlegada();
          }
          break;
        }
      }

      // Comparamos la cantidad de pasajeros en todas las colas en la iteración actual.
      cantMaxPasajerosEnAlgunaCola = Math.max(
        colaVentaFacturacion.length,
        colaVentaFacturacion.length,
        colaChequeoBillete.length,
        colaControlMetales.length,
        cantMaxPasajerosEnAlgunaCola
      );

      cantMaxPasajerosEnColaControl = Math.max(
        colaControlMetales.length,
        cantMaxPasajerosEnColaControl
      );

      // Cargamos la matriz de estado a mostrar solo para el rango pasado por parámetro.
      if ((i >= eventoDesde && i <= indiceHasta) || i == cantEventos-1) {
        evento.push(
          i.toString(),
          EventoAlt[tipoEvento],
          reloj.toFixed(4),
  
          rndLlegada.toFixed(4),
          tiempoEntreLlegadas.toFixed(4),
          proximaLlegada.toFixed(4),
          rndTipoPasajero.toFixed(4),
          tipoPasajero,
  
          rndVentaFacturacion.toFixed(4),
          tiempoVentaFacturacion.toFixed(4),
          finVentaFacturacionEmp1.toFixed(4),
          finVentaFacturacionEmp2.toFixed(4),
  
          rnd1ChequeoBillete.toFixed(4),
          rnd2ChequeoBillete.toFixed(4),
          tiempoChequeoBillete.toFixed(4),
          finChequeoBillete.toFixed(4),
  
          rndControlMetales.toFixed(4),
          tiempoControlMetales.toFixed(4),
          finControlMetales.toFixed(4),
  
          rndPaseEntreVentaFacturacionYControl.toFixed(4),
          tiempoPaseEntreVentaFacturacionYControl.toFixed(4),
          finPaseEntreVentaFacturacionYControl.toFixed(4),
  
          rndPaseEntreChequeoYControl.toFixed(4),
          tiempoPaseEntreChequeoYControl.toFixed(4),
          finPaseEntreChequeoYControl.toFixed(4),
  
          rndPaseEntreControlYEmbarque.toFixed(4),
          tiempoPaseEntreControlYEmbarque.toFixed(4),
          finPaseEntreControlYEmbarque.toFixed(4),
  
          empleado1VentaFacturacion.getEstado(),
          empleado2VentaFacturacion.getEstado(),
          colaVentaFacturacion.length.toString(),
  
          empleadoChequeoBillete.getEstado(),
          colaChequeoBillete.length.toString(),
  
          empleadoControlMetales.getEstado(),
          colaControlMetales.length.toString(),
  
          totalPasajerosA.toString(),
          totalPasajerosB.toString(),
          totalPasajerosC.toString(),
          totalPasajeros.toString(),
          acuTiempoPasajeros.toFixed(4),
          acuTiempoOciosoEmpControl.toFixed(4),
          cantPasajerosAtentidosPorVentaFacturacion.toString(),
          cantMaxPasajerosEnAlgunaCola.toString(),
          cantMaxPasajerosEnColaControl.toString()
        );
  
        for (let i: number = 0; i < pasajerosEnSistema.length; i++) {
          evento.push(
            pasajerosEnSistema[i].getId().toString(),
            pasajerosEnSistema[i].getTipoPasajero(),
            EstadoPasajeroAlt[pasajerosEnSistema[i].getEstado()],
            pasajerosEnSistema[i].getMinutoLlegada().toFixed(4),
            pasajerosEnSistema[i].minutoLlegadaDeVentaFacturacionAControl.toFixed(4),
            pasajerosEnSistema[i].minutoLlegadaDeChequeoBilleteAControl.toFixed(4),
            pasajerosEnSistema[i].minutoLlegadaDeControlAEmbarque.toFixed(4),
            );
        }

        this.matrizEstado.push(evento);

        // Actualizamos la cantidad de pasajeros máximos que hubo en el sistema.
        if (pasajerosEnSistema.length > this.cantMaxPasajeros)
          this.cantMaxPasajeros = pasajerosEnSistema.length;
      }

      // Reseteamos algunas variables.
      rndTipoPasajero = null;
      tipoPasajero = "";
    }
  }

  public getMatrizEstado(): any[][] {
    return this.matrizEstado;
  }

  public getSiguienteEvento(tiemposEventos: number[]): EventoAlt {
    let menor: number = Utils.getMenorMayorACero(tiemposEventos);
    for (let i: number = 0; i < tiemposEventos.length; i++) {
      if (tiemposEventos[i] === menor) {
        if (i < 5)
          return EventoAlt[EventoAlt[i+1]];
        else {
          switch (i % 3) {
            case 0: {
              return EventoAlt.FIN_PASO_ENTRE_CHEQUEO_Y_CONTROL;
            }
            case 1: {
              return EventoAlt.FIN_PASO_ENTRE_CONTROL_Y_EMBARQUE;
            }
            case 2: {
              return EventoAlt.FIN_PASO_ENTRE_VENTA_FACTURACION_Y_CONTROL;

            }
          }
        }
      }
    }
    return -1;
  }

  // Cálculo del tiempo de venta-facturación.
  public getTiempoVentaFacturacion(rndTiempoVentaFacturacion: number): number {
    let tiempo: number;
    if (rndTiempoVentaFacturacion < 0.5)
      tiempo = this.aTiempoFacturacion + rndTiempoVentaFacturacion * (this.bTiempoFacturacion - this.aTiempoFacturacion);
    else
      tiempo = this.getDistribucionExponencial(rndTiempoVentaFacturacion, this.mediaTiempoVentaBilletes);
    return tiempo;
  }
}