import { default as dayjs } from 'dayjs';
class SolicitudModel {
    id: number;
    fecha_creacion?: string;
    fecha_edicion?: string;
    asunto: string;
    numero_documento: string;
    fecha_inicio: string;
    fecha_plazo: string;
    motivo: string;
    estado: string;
    tipo_entidad: string;
    i_total: number;
    id_tipo_documento: number;
    id_documento: number;
    id_area: number;
    id_empleado: number;
    id_persona: number;
    id_empresa?: number;
    url_archivo_solicitud?: string;

    constructor() {

        this.id = 0;
        this.asunto = "";
        this.numero_documento = "";
        this.fecha_inicio = dayjs().format("YYYY-MM-DD")
        this.fecha_creacion = dayjs().format("YYYY-MM-DD")
        this.fecha_plazo = "";
        this.motivo = "";
        this.estado = "REGISTRADO";
        this.tipo_entidad = "NATURAL";
        this.i_total = 0;
        this.id_tipo_documento = 0;
        this.id_documento = 0;
        this.id_area = 0;
        this.id_empleado = 0;
        this.id_persona = 0;
    }
}
export default SolicitudModel


