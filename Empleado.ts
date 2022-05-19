import { EstadoEmpleado } from "./EstadoEmpleado";

export class Empleado {
  private estado: EstadoEmpleado;

  public libre(): void {
    this.estado = EstadoEmpleado.LIBRE;
  }

  public ocupado(): void {
    this.estado = EstadoEmpleado.OCUPADO;
  }

  public getEstado(): EstadoEmpleado {
    return this.estado;
  }
}