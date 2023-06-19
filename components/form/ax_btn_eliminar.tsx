import { EnumTipoEdicion, EnumEstadoEdicion } from 'lib/edicion'
export default function AxBtnEliminar({ tipoEdicion, setTipoEdicion, setOpen, setEstadoEdicion }: any) {
    return <button type="button"
        disabled={tipoEdicion == EnumTipoEdicion.EDITAR || tipoEdicion == EnumTipoEdicion.AGREGAR}
        onClick={() => {
            setTipoEdicion(EnumTipoEdicion.ELIMINAR);
            setOpen(true);
            setEstadoEdicion(EnumEstadoEdicion.EDITANDO);
        }}
        className="ml-3 inline-flex items-center px-3 py-2 border 
    border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
    disabled:bg-indigo-300"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Eliminar
    </button>
}