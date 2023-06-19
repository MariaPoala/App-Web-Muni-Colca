import { DocumentAddIcon } from '@heroicons/react/outline';
import { EnumTipoEdicion, EnumEstadoEdicion } from 'lib/edicion'
export default function AxBtnAgregarArchivoSolicitud({ setEstadoEdicion, setID, setTipoEdicion,  setTipoModal}: any) {
    return <button type="button"
    onClick=
    {() => {
      setID(0);
      setEstadoEdicion(EnumEstadoEdicion.EDITANDO);
      setTipoEdicion(EnumTipoEdicion.AGREGAR);
      setTipoModal('EDICION');
    }}
    className="ml-3    inline-flex items-center px-3 py-2 border 
                                border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                disabled:bg-blue-300"
  >
    <DocumentAddIcon className="h-4 w-4 mr-1 text-white" aria-hidden="true" />
    Agregar
  </button>
}

