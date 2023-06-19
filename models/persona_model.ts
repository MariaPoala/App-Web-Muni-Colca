class PersonaModel {
    id: number;
    fecha_creacion?: string;
    fecha_edicion?: string;
    tipo_documento: string;
    numero_documento: string;
    nombre: string;
    apellido: string;
    fecha_nacimiento: string;
    sexo: string;
    direccion: string;
    celular?: string;
    email?: string;
    estado: boolean;
    id_distrito: number;
    id_anexo?: number;

    constructor() {
        this.id = 0;
        this.tipo_documento = "DNI";
        this.numero_documento = "";
        this.nombre = "";
        this.apellido = "";
        this.fecha_nacimiento = "";
        this.sexo = "";
        this.direccion = "";
        this.estado = true;
        this.id_distrito = 0;
    }
}
export default PersonaModel


