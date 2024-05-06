import {
	DEFAULT_CODE,
	DEFAULT_ERROR,
	PROCEDURE_MAP,
	PROCEDURE_NOT_FOUND_ERROR,
	PROTOCOL_CONTENT_TYPE_MAP,
	PROTOCOL_METHOD_MAP,
} from "../constants.js";
import { registerProcedures } from "../register.js";
import type { Procedure } from "../types.js";
import {
	findProcedure,
	getProcedureMapKey,
	getProcedureTypeFromMethod,
} from "../utils.js";

const universalHandler = async (
	procedure: Procedure.Any | undefined,
	request: Request,
) => {
	if (procedure) {
		try {
			const result = await procedure.handler(
				await request[
					PROTOCOL_METHOD_MAP[
						procedure.contract.protocol as keyof typeof PROTOCOL_METHOD_MAP
					]
				](),
			);

			return new Response(result as any, {
				headers: {
					...procedure.contract.headers,
					"content-type":
						PROTOCOL_CONTENT_TYPE_MAP[
							procedure.contract
								.protocol as keyof typeof PROTOCOL_CONTENT_TYPE_MAP
						],
				},
				status: 200,
			});
		} catch (e: any) {
			const message = e?.message ?? DEFAULT_ERROR;

			return new Response(message, {
				status: e?.code ?? DEFAULT_CODE,
			});
		}
	}

	return new Response(PROCEDURE_NOT_FOUND_ERROR, {
		status: 404,
	});
};

export const universalMapRouter = (procedures: Procedure.Any[]) => {
	registerProcedures(procedures);

	return (request: Request) => {
		return universalHandler(
			PROCEDURE_MAP.get(
				getProcedureMapKey(request.method, new URL(request.url).pathname),
			),
			request,
		);
	};
};

export const universalArrayRouter = (procedures: Procedure.Any[]) => {
	return (request: Request) => {
		return universalHandler(
			findProcedure(
				getProcedureTypeFromMethod(request.method),
				new URL(request.url).pathname,
				procedures,
			),
			request,
		);
	};
};
