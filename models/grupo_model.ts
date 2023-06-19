class GrupoModel {
    id: number;
    fecha_creacion?: string;
    fecha_edicion?: string;
    nombre: string;
    descripcion?: string;

    constructor() {
        this.id = 0;
        this.nombre = "";
    }
}
export default GrupoModel


