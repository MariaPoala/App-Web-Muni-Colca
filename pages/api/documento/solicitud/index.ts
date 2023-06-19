import FnApiData from "lib/database/api_data";
import DocumentoModel from "models/documento_model";

export default async function handler(req: any, res: any) {
    const { data, error } = await FnApiData<DocumentoModel>("solicitud", req.method, req.body, req.query);
    if (error) {
        res.status(401).json(error);
    }
    else {
        res.status(200).json(data);
    }
}
