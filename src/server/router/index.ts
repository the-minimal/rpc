import {
	DEFAULT_CODE,
	DEFAULT_ERROR,
	PROCEDURE_MAP,
	PROCEDURE_NOT_FOUND_ERROR,
} from "@constants";
import type { AnyProcedure } from "@types";
import {
	findProcedure,
	getProcedureMapKey,
	registerProcedure,
} from "../utils/index.js";

const universalHandler = async (
	procedure: AnyProcedure | undefined,
	request: Request,
) => {
	if (procedure) {
		try {
			const result = await procedure.handler(
				await request.arrayBuffer(),
				new URL(request.url).hash,
			);

			return new Response(result, {
				headers: {
					...(procedure.contract.headers || {}),
					"Content-Type": "application/octet-stream",
					"Content-Length": `${result.byteLength}`,
				},
				status: 200,
			});
		} catch (e: any) {
			return new Response(e?.message || DEFAULT_ERROR, {
				status: e?.code ?? DEFAULT_CODE,
			});
		}
	}

	return new Response(PROCEDURE_NOT_FOUND_ERROR, {
		status: 404,
	});
};

export const universalMapRouter = (procedures: AnyProcedure[]) => {
	registerProcedure(procedures);

	return (request: Request) => {
		return universalHandler(
			PROCEDURE_MAP.get(
				getProcedureMapKey(request.method, new URL(request.url).pathname),
			),
			request,
		);
	};
};

export const universalArrayRouter = (procedures: AnyProcedure[]) => {
	return (request: Request) => {
		return universalHandler(
			findProcedure(request.method, new URL(request.url).pathname, procedures),
			request,
		);
	};
};