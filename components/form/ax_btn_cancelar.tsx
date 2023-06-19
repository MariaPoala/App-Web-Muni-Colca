import { EnumTipoEdicion, EnumEstadoEdicion } from 'lib/edicion'
import { TypeBtnCancelarProps, } from 'lib/edicion'

export default function AxBtnCancelar({ setEstadoEdicion, setTipoEdicion, tipoEdicion, setID }: TypeBtnCancelarProps) {
    return <button onClick={() => {
        setEstadoEdicion(EnumEstadoEdicion.CANCELADO);
        if (tipoEdicion == EnumTipoEdicion.AGREGAR) setID(-1);
        setTipoEdicion(EnumTipoEdicion.VISUALIZAR);
    }}
        type="button"
        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
        Cancelar
    </button>
}