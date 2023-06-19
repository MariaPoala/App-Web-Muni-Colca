class Tipo_DocumentoModel {
    id: number;
    fecha_creacion?: string;
    fecha_edicion?: string;
    nombre: string;
    descripcion: string;
    url_imagen?: string;

    constructor() {
        this.id = 0;
        this.nombre = "";
        this.descripcion = "";
    }
}

export default Tipo_DocumentoModel


