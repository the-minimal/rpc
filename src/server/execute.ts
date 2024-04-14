import { Procedures } from "../types";
import { error } from "./error";
import { searchToProxy } from "./utils";

export const execute = async (
	procedures: Procedures, 
	procedureName: string, 
	url: URL,
	req: Request
) => {
	const query = req.method.charCodeAt(0) === 71;

	if (!procedureName) {
		error(404, "Procedure not provided");
	} else if (!(procedureName in procedures)) {
		error(404, `Procedure [${procedureName}] does not exist`);
	}

	const procedure = procedures[procedureName];

	if (procedure.input) {
		const data = query
			? searchToProxy(url.search)
			: (await req.json());

		(procedure.input as any)(data);

		return (await procedure.handler(data, req));
	} else {
		return (await procedure.handler(null, req));
	}
};
