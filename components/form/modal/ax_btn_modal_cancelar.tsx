import { EnumEstadoEdicion, EnumTipoEdicion } from 'lib/edicion'
export default function AxBtnModalCancelar({ setTipoEdicion, setEstadoEdicion, setOpen }: any) {
    return <button
        onClick={() => {
            if (setTipoEdicion) setTipoEdicion(EnumTipoEdicion.VISUALIZAR);
            if (setEstadoEdicion) setEstadoEdicion(EnumEstadoEdicion.CANCELADO);
            if (setOpen) setOpen(false);
        }}
        type="button"
        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
        Cancelar
    </button>
}

