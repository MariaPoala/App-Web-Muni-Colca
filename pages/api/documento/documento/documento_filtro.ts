import supabase from "lib/supabase_config";

export default async function handler(req: any, res: any) {
    try {
        if (req.method == "GET") {
            const { data, error } = await supabase
                .from('documento')
                .select()
                .eq('es_anulado', false)
            res.status(200).json(data);
        }
        else {
            throw "METODO NO IMPLEMENTADO"
        }
    } catch (e) {
        res.status(501).json({ data: null, error: e });
    }
}
