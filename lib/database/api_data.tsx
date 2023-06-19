import supabase from "lib/supabase_config";

export default async function FnApiData<T>(table: string, method: string, body: any, query?: any): Promise<{ data: null | T | T[]; error: any }> {
    try {
        const datos = { ...body };
        const id = datos.id;
        if (method == "GET") {
            let dataRespuesta: any = [];
            let errorRespuesta: any = null;
            if (query && query.inicio) {
                const { inicio, cantidad } = query;
                const { data, error } = await supabase.from<T>(table).select().range(inicio, cantidad).order('id' as keyof T, { ascending: false })
                dataRespuesta = data;
                errorRespuesta = error;
            }
            else {
                const { data, error } = await supabase.from<T>(table).select().order('id' as keyof T, { ascending: false })
                dataRespuesta = data;
                errorRespuesta = error;
            }
            return { data: dataRespuesta, error: errorRespuesta };
        }
        else if (method === 'POST') {
            delete datos['id'];
            delete datos['fecha_creacion'];
            delete datos['fecha_edicion'];
            const { data, error } = await supabase.from<T>(table).insert(datos);
            return { data: data && data[0], error }
        }
        else if (method == "PUT") {
            delete datos['id'];
            delete datos['fecha_creacion'];
            delete datos['fecha_edicion'];
            const { data, error } = await supabase.from<T>(table).update(datos).match({ id: id })
            return { data: data && data[0], error }
        }
        else if (method == "DELETE") {
            const { data, error } = await supabase.from(table).delete().match({ id: id })
            return { data: data && data[0], error }
        }
        return { data: null, error: { msg: "Metodo no implementado" } };

    } catch (e) {
        return { data: null, error: e };
    }
}