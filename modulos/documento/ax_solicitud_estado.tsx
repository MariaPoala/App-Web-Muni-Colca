import { useEffect, useReducer, useState } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AxSelect, AxSubmit, AxBtnModalCancelar } from 'components/form'
import { EnumTipoEdicion, EnumEstadoEdicion } from 'lib/edicion'
import SolicitudModel from 'models/solicitud_model'

export const getServerSideProps = withPageAuthRequired();
const formReducer = (state: SolicitudModel, event: any): SolicitudModel => {
    if (event.FORM_DATA) {
        return { ...event.FORM_DATA }
    }
    if (event.FORM_ADD) {
        return new SolicitudModel()
    }
    return { ...state, [event.name]: event.value }
}

export default function AxSolicitudEstado({ ID, setID, setEstadoEdicion, tipoEdicion, setOpen }: any) {
    const [formData, setFormData] = useReducer(formReducer, new SolicitudModel());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    // const storage = getStorage();
    const [listaimage, setListaimage] = useState<Array<any>>([]);
    useEffect(() => {
        setIsLoading(true)
        const fetchData = async () => {
            const response = await fetch(`/api/documento/solicitud/${ID}`);
            const data: SolicitudModel = await response.json();
            setFormData({ FORM_DATA: data });
        }
        fetchData().catch(console.error);
        setIsLoading(false)
    }, [ID])

    const handleChange = (name: string, value: string) => {
        setFormData({
            name: name,
            value: value
        })
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setIsSubmitting(true);
        const dataEnvio = JSON.stringify(formData);
        const response = await fetch('/api/documento/solicitud', {
            body: dataEnvio,
            headers: { 'Content-Type': 'application/json', },
            method: tipoEdicion == EnumTipoEdicion.EDITAR ? "PUT" : tipoEdicion == EnumTipoEdicion.ELIMINAR ? "DELETE" : "POST"
        })
        const result: SolicitudModel = await response.json()
        if (tipoEdicion == EnumTipoEdicion.AGREGAR) setID(result.id);
        setIsSubmitting(false);
        if (tipoEdicion == EnumTipoEdicion.ELIMINAR) setID(-1);
        setEstadoEdicion(EnumEstadoEdicion.GUARDADO);
    }
    return (
        <>
            <div className={isLoading ? "animate-pulse" : "" + " flex h-full flex-col  bg-white shadow-xl "}>
                <div className="divide-y divide-gray-200">
                    {/*PORTADA*/}
                    <div className="h-1 mt-1 bg-indigo-700 rounded-sm" />
                    {/*FORMULARIO*/}
                    <div className="px-0 py-0 m-2 ">
                        <div className="p-4 md:p-2">
                            <form className="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
                                <fieldset disabled={tipoEdicion == EnumTipoEdicion.VISUALIZAR} className="space-y-8 divide-y divide-gray-200">
                                    <div className="">
                                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-5">
                                            <button
                                                type="button"
                                                onClick={() => { handleChange("estado", "REGISTRADO") }}
                                                className={(formData.estado == "REGISTRADO" ? "ring-4 ring-offset-4 ring-blue-500 " : "") + "inline-flex items-center px-3.5 py-2 border border-transparent text-sm leading-4 font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"}
                                            >
                                                REGISTRADO
                                            </button>
                                            <button
                                                onClick={() => { handleChange("estado", "VALIDADO") }}
                                                type="button"
                                                className={(formData.estado == "VALIDADO" ? "ring-4 ring-offset-4 ring-blue-500 " : "") + "inline-flex items-center px-3.5 py-2 border border-transparent text-sm leading-4 font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"}
                                            >
                                                VALIDADO
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { handleChange("estado", "RECHAZADO") }}
                                                className={(formData.estado == "RECHAZADO" ? "ring-4 ring-offset-4 ring-blue-500 " : "") + "inline-flex items-center px-3.5 py-2 border border-transparent text-sm leading-4 font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"}
                                            >
                                                RECHAZADO
                                            </button>                                            
                                            <button
                                                type="button"
                                                onClick={() => { handleChange("estado", "FINALIZADO") }}
                                                className={(formData.estado == "FINALIZADO" ? "ring-4 ring-offset-4 ring-blue-500 " : "") + "inline-flex items-center px-3.5 py-2 border border-transparent text-sm leading-4 font-medium rounded-full shadow-sm text-white bg-black hover:bg-zinc-700 focus:outline-none"}
                                            >
                                                FINALIZADO
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { handleChange("estado", "ENTREGADO") }}
                                                className={(formData.estado == "ENTREGADO" ? "ring-4 ring-offset-4 ring-blue-500 " : "") + "inline-flex items-center px-3.5 py-2 border border-transparent text-sm leading-4 font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"}
                                            >
                                                ENTREGADO
                                            </button>
                                        </div>
                                    </div>

                                </fieldset>

                                {tipoEdicion != EnumTipoEdicion.VISUALIZAR && <div className="pt-5">
                                    <div className="flex justify-end">
                                        <AxBtnModalCancelar setEstadoEdicion={setEstadoEdicion} />
                                        <AxSubmit loading={isSubmitting} />
                                    </div>
                                </div>
                                }
                            </form >
                        </div >
                    </div>
                </div>
            </div >
        </>
    )
}
