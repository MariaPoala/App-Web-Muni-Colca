import { EnumEstadoEdicion } from "./enum_estado_edicion";
import { EnumTipoEdicion } from "./enum_tipo_edicion";
type TypeSetID = (ID: number) => any;
type TypeSetEstadoEdicion = (luegoEdicion: EnumEstadoEdicion) => any;
type TypeSetTipoEdicion = (tipoEdicion: EnumTipoEdicion) => any;

type TypeFormularioProps = {
    ID: number
    setID: TypeSetID,
    setEstadoEdicion: TypeSetEstadoEdicion,
    tipoEdicion?: EnumTipoEdicion
}

type TypeBtnCancelarProps = {
    setID: TypeSetID,
    setEstadoEdicion: TypeSetEstadoEdicion,
    tipoEdicion: EnumTipoEdicion,
    setTipoEdicion: TypeSetTipoEdicion
}

type TypeBtnCancelarModalProps = {
    setID: TypeSetID,
    setEstadoEdicion: TypeSetEstadoEdicion
}

export type { TypeBtnCancelarProps, TypeFormularioProps };