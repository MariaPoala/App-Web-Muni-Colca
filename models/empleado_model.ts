class EmpleadoModel {
    id: number;
    fecha_creacion?: string;
    fecha_edicion?: string;
    nombre: string;
    apellido: string;
    numero_documento: string;
    fecha_nacimiento: string;
    sexo: string;
    direccion: string;
    celular: string|null;
    email?: string;
    tipo_contrato: string;
    estado: boolean;
    url_imagen?: string;
    id_distrito: number;
    id_anexo?: number;
    id_area: number;
    id_rol: number;
    constructor() {
        this.id = 0;
        this.nombre = "";
        this.apellido = "";
        this.numero_documento = "";
        this.fecha_nacimiento = "";
        this.sexo = "MUJER";
        this.direccion = "";
        this.tipo_contrato = "Contrato3Meses";
        this.estado = true;
        this.celular=null;
        this.id_area = 0;
        this.id_rol = 0;
        this.id_distrito = 0;
    }
}
export default EmpleadoModel


