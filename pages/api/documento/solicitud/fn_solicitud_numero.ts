import supabase from "lib/supabase_config";

export default async function handler(req: any, res: any) {
    try {
        if (req.method == "GET") {
            const { codigo, year } = req.query;
            const { data, error } = await supabase
                .rpc('fn_solicitud_numero', { _codigo_tipo_solicitud: codigo, _year: year })
            if (error) {
                res.status(401).json(error);
            }
            else {
                res.status(200).json(data);
            }

        }
        else {
            throw "METODO NO IMPLEMENTADO"
        }
    } catch (e) {
        res.status(501).json({ data: null, error: e });
    }
}
