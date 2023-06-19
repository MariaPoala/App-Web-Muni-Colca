class EmpresaModel {
    id: number;
    fecha_creacion?: string;
    fecha_edicion?: string;
    numero_ruc: string;
    razon_social: string;
    direccion: string;
    celular?: string;
    email?: string;
    estado: boolean;
    id_distrito: number;
    id_anexo?: number;
    constructor() {
        this.id = 0;
        this.numero_ruc = "";
        this.razon_social = "";
        this.direccion = "";
        this.estado = true;
        this.id_distrito = 0;
    }
}

export default EmpresaModel


