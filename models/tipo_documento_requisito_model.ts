class TipoDocumentoRequisitoModel {
    id: number;
    fecha_creacion?: string;
    fecha_edicion?: string;
    id_tipo_documento: number;
    id_requisito: number;

    constructor() {
        this.id = 0;
        this.id_tipo_documento = 0;
        this.id_requisito = 0;
    }
}
export default TipoDocumentoRequisitoModel


