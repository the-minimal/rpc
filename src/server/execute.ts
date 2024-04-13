import { Namespaces } from "../types";
import { error } from "./error";
import { searchToProxy } from "./utils";

export const execute = async (routes: Namespaces, req: Request) => {
	const url = new URL(req.url);
	const query = req.method.charCodeAt(0) === 71;
	const paths = url.pathname.slice(1).split("/");
	const namespaceName = paths[0];
	const procedureName = paths[1];

	if (!namespaceName) {
		error(404, "Namespace not provided");
	} else if (!(namespaceName in routes)) {
		error(404, `Namespace [${namespaceName}] does not exist`);
	} else if (!procedureName) {
		error(404, "Procedure not provided");
	} else if (!(procedureName in routes[namespaceName])) {
		error(404, `Procedure [${procedureName}] does not exist`);
	}

	const procedure = routes[namespaceName][procedureName];

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
