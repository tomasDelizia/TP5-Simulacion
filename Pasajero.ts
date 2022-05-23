import { EstadoPasajero } from "./EstadoPasajero";

export class Pasajero {
  private id: number;
  private tipoPasajero: string;
  private minutoLlegada: number;
  private estado: EstadoPasajero;

  public Pasajero(id: number, tipoPasajero: string, minutoLlegada: number) {
    this.id = id;
    this.tipoPasajero = tipoPasajero;
    this.minutoLlegada = minutoLlegada;
  }

  public facturarEquipaje(): void {
    this.estado = EstadoPasajero.FACTURANDO_EQUIPAJE;
  }

  public enEsperaFacturacion(): void {
    this.estado = EstadoPasajero.ESPERANDO_FACTURACION;
  }

  public enControlMetales(): void {
    this.estado = EstadoPasajero.EN_CONTROL_METALES;
  }

  public enEsperaControlMetales(): void {
    this.estado = EstadoPasajero.ESPERANDO_CONTROL;
  }

  public comprarBillete(): void {
    this.estado = EstadoPasajero.COMPRANDO_BILLETE;
  }

  public enEsperaCompraBillete(): void {
    this.estado = EstadoPasajero.ESPERANDO_COMPRA_BILLETE;
  }

  public chequearBillete(): void {
    this.estado = EstadoPasajero.CHEQUEANDO_BILLETE;
  }

  public enEsperaChequeoBilletes(): void {
    this.estado = EstadoPasajero.ESPERANDO_CHEQUEO_BILLETE;
  }

  public cambiarDeZona(): void {
    this.estado = EstadoPasajero.PASANDO_ENTRE_ZONAS;
  }

  public getEstado(): EstadoPasajero {
    return this.estado;
  }

  public getId(): number {
    return this.id;
  }

  public getTipoPasajero(): string {
    return this.tipoPasajero;
  }

  public getMinutoLlegada(): number {
    return this.minutoLlegada;
  }
}