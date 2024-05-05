import { PROCEDURE_MAP } from "./constants";
import { Procedure } from "./types";

export const callProcedure = (request: Request) => {
	const url = new URL(request.url);
	const key = `${request.method === "GET" 
		? Procedure.Type.Query 
		: Procedure.Type.Mutation}:${
			url.pathname
		}`;

	const procedure = PROCEDURE_MAP.get(key);

	if (procedure) {
		return procedure.handler(request);
	}

	return new Response(null, {
		status: 404,
		statusText: "Procedure not found",
	});
};
