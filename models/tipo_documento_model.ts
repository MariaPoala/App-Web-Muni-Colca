class TipoDocumentoModel {
    id: number;
    fecha_creacion?: string;
    fecha_edicion?: string;
    codigo: string;
    nombre: string;
    descripcion?: string;
    tiempo_entrega?: number;
    costo: number;
    id_grupo: number;
    tipo_documento_consideracion: number[];
    tipo_documento_requisito: number[];
    forma_entrega:string;

    constructor() {
        this.id = 0;
        this.nombre = "";
        this.codigo = "";
        this.descripcion = "";
        this.tiempo_entrega = 0;
        this.costo = 0;
        this.forma_entrega="DIRECTO"
        this.id_grupo = 0;
        this.tipo_documento_consideracion = []
        this.tipo_documento_requisito = []
    }
}
export default TipoDocumentoModel


