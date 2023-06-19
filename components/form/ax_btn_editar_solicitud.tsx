import { EnumTipoEdicion, EnumEstadoEdicion } from 'lib/edicion'
export default function AxBtnEditarSolicitud({ estadoEdicion, setTipoEdicion, setEstadoEdicion,setTipoModal }: any) {
    return <button type="button"
        onClick={() => {
            setTipoEdicion(EnumTipoEdicion.EDITAR);
            setEstadoEdicion(EnumEstadoEdicion.EDITANDO);
            setTipoModal('EDICION');
        }}
        disabled={estadoEdicion != EnumEstadoEdicion.SELECCIONADO}
        className="ml-3 inline-flex items-center px-3 py-2 border  
                                            border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                                            disabled:bg-indigo-300"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Editar
    </button>
}

