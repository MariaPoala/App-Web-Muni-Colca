import supabase from "lib/supabase_config";
import DocumentoModel from "models/documento_model";

export default async function handler(req: any, res: any) {
    const { id } = req.query
    const { data, error } = await supabase.from<DocumentoModel>('documento').select().eq('id' as keyof DocumentoModel, id);
    if (data && data.length > 0) {
        res.status(200).json(data[0])
    } else {
        res.status(200).json({ error: "documento no encontrado" })
    }
}