import FnSaveData from "lib/database/api_data";
import AnexoModel from "models/anexo_model";

export default async function handler(req: any, res: any) {
    const { data, error } = await FnSaveData<AnexoModel>("anexo", req.method, req.body);
    if (error) {
        res.status(401).json(error);
    }
    else {
        res.status(200).json(data);
    }
}
