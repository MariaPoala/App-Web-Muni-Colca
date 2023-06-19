import supabase from "lib/supabase_config";
import EmpresaModel from "models/empresa_model";

export default async function handler(req: any, res: any) {
    const { id } = req.query
    const { data, error } = await supabase.from<EmpresaModel>('empresa').select().eq('id' as keyof EmpresaModel, id);
    if (data && data.length > 0) {
        res.status(200).json(data[0])
    } else {
        res.status(200).json({ error: "registros no encontrado" })
    }
}