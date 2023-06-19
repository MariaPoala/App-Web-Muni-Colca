class SolicitudSeguimientoModel {
    id: number;
    fecha_creacion?: string;
    fecha_edicion?: string;
    fecha: string;
    estado: string;
    observaciones: string;
    id_solicitud: number;
    id_empleado: number;
    id_area: number;

    constructor() {
        this.id = 0;
        this.estado = "";
        this.observaciones = "";
        this.fecha = "";
        this.id_solicitud = 0;
        this.id_empleado = 0;
        this.id_area = 0;
    }
}
export default SolicitudSeguimientoModel


