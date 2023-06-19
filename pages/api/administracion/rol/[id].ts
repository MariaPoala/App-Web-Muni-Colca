import supabase from "lib/supabase_config";
import RolModel from "models/rol_model";

export default async function handler(req: any, res: any) {
    const { id } = req.query
    const { data, error } = await supabase.from<RolModel>('rol').select().eq('id' as keyof RolModel, id);
    if (data && data.length > 0) {
        res.status(200).json(data[0])
    } else {
        res.status(200).json({ error: "documento no encontrado" })
    }
}