import supabase from "lib/supabase_config";
import TipoDocumentoModel from "models/tipo_documento_model";
import TipoDocumentoConsideracionModel from "models/tipo_documento_consideracion_model";
import TipoDocumentoRequisitoModel from "models/tipo_documento_requisito_model";

export default async function handler(req: any, res: any) {
    const { id } = req.query
    const { data: data_tipo_documento, error: error_tipo_documento } = await supabase.from<TipoDocumentoModel>('tipo_documento').select().eq('id' as keyof TipoDocumentoModel, id);
    const { data: data_consideracion, error: error_consideracion } = await supabase.from<TipoDocumentoConsideracionModel>('tipo_documento_consideracion').select().eq('id_tipo_documento' as keyof TipoDocumentoConsideracionModel, id);
    const { data: data_requisito, error: error_requisito } = await supabase.from<TipoDocumentoRequisitoModel>('tipo_documento_requisito').select().eq('id_tipo_documento' as keyof TipoDocumentoRequisitoModel, id);

    if (data_tipo_documento && data_tipo_documento.length > 0) {
        if (data_consideracion) data_tipo_documento[0].tipo_documento_consideracion = data_consideracion?.map(item => (item.id_consideracion));
        else data_tipo_documento[0].tipo_documento_consideracion = []

        if (data_requisito) data_tipo_documento[0].tipo_documento_requisito = data_requisito?.map(item => (item.id_requisito));
        else data_tipo_documento[0].tipo_documento_requisito = []

        res.status(200).json(data_tipo_documento[0])
    } else {
        res.status(200).json({ msg: "registros no encontrado", error_tipo_documento })
    }
}