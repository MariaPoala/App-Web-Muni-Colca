import supabase from "lib/supabase_config";
import ConsideracionModel from "models/consideracion_model";
import TipoDocumentoConsideracionModel from "models/tipo_documento_consideracion_model";
import TipoDocumentoModel from "models/tipo_documento_model";

export default async function handler(req: any, res: any) {
    let dataRespuesta: any = [];
    let errorRespuesta: any = null;
    try {
        const datos = { ...req.body };
        const id = datos.id;
        if (req.method == "GET") {
            const { data, error } = await supabase.from<TipoDocumentoModel>("tipo_documento").select().order('id', { ascending: true })
            dataRespuesta = data;
            errorRespuesta = error;
        }
        else if (req.method === 'POST') {
            const consideracion = [...datos.tipo_documento_consideracion];
            const requisito = [...datos.tipo_documento_requisito];
            delete datos['id'];
            delete datos['fecha_creacion'];
            delete datos['fecha_edicion'];
            delete datos['tipo_documento_consideracion'];
            delete datos['tipo_documento_requisito'];
            const { data: data_tipo_documento, error: error_tipodocumento } = await supabase.from<TipoDocumentoModel>("tipo_documento").insert(datos);
            if (data_tipo_documento) {
                const datos_consideracion = consideracion.map((item: any) => ({ id_tipo_documento: data_tipo_documento[0].id, id_consideracion: item }));
                const { data: data_consideracion, error: error_consideracion } = await supabase.from<TipoDocumentoConsideracionModel>("tipo_documento_consideracion").insert(datos_consideracion);

                const datos_requisito = requisito.map((item: any) => ({ id_tipo_documento: data_tipo_documento[0].id, id_requisito: item }));
                const { data: data_requisito, error: error_requisito } = await supabase.from<TipoDocumentoConsideracionModel>("tipo_documento_requisito").insert(datos_requisito);
            }
            dataRespuesta = data_tipo_documento;
            errorRespuesta = error_tipodocumento;
        }
        else if (req.method == "PUT") {
            const consideracion = [...datos.tipo_documento_consideracion];
            const requisito = [...datos.tipo_documento_requisito];
            delete datos['id'];
            delete datos['fecha_creacion'];
            delete datos['fecha_edicion'];
            delete datos['tipo_documento_consideracion'];
            delete datos['tipo_documento_requisito'];
            const { data: data_eliminacion1, error: error_eliminacion1 } = await supabase.from("tipo_documento_consideracion").delete().match({ id_tipo_documento: id })
            const { data: data_eliminacion2, error: error_eliminacion2 } = await supabase.from("tipo_documento_requisito").delete().match({ id_tipo_documento: id })

            const datos_consideracion = consideracion.map((item: any) => ({ id_tipo_documento: id, id_consideracion: item }));
            const datos_requisito = requisito.map((item: any) => ({ id_tipo_documento: id, id_requisito: item }));

            const { data: data_consideracion, error: error_consideracion } = await supabase.from<TipoDocumentoConsideracionModel>("tipo_documento_consideracion").insert(datos_consideracion);
            const { data: data_requisito, error: error_requisito } = await supabase.from<TipoDocumentoConsideracionModel>("tipo_documento_requisito").insert(datos_requisito);

            const { data, error } = await supabase.from<TipoDocumentoModel>("tipo_documento").update(datos).match({ id: id })
            dataRespuesta = data;
            errorRespuesta = error;
        }
        else if (req.method == "DELETE") {
            const { data: data_eliminacion, error: error_eliminacion } = await supabase.from("tipo_documento_consideracion").delete().match({ id_tipo_documento: id })
            const { data: data_requisito, error: error_requisito } = await supabase.from("tipo_documento_requisito").delete().match({ id_tipo_documento: id })
            const { data, error } = await supabase.from("tipo_documento").delete().match({ id: id })
            dataRespuesta = data;
            errorRespuesta = error;
        }

    } catch (e) {
        dataRespuesta = null;
        errorRespuesta = e;
    }

    if (errorRespuesta) {
        res.status(401).json(errorRespuesta);
    }
    else {
        res.status(200).json(dataRespuesta);
    }
}
