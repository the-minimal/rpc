import {
	DEFAULT_CODE,
	DEFAULT_ERROR,
	PROCEDURE_MAP,
	PROCEDURE_NOT_FOUND_ERROR,
} from "@constants";
import type { AnyProcedure, MethodValue } from "@types";
import { Method } from "@types";
import { base64ToBytes } from "../base64ToBytes/index.js";
import { findProcedure } from "../findProcedure/index.js";
import { getProcedureMapKey } from "../getProcedureMapKey/index.js";
import { registerProcedure } from "../registerProcedure/index.js";

const universalHandler = async (
	procedure: AnyProcedure | undefined,
	request: Request,
) => {
	if (procedure) {
		try {
			const result = await procedure.handler(
				procedure.contract.input
					? procedure.contract.method === Method.Post
						? await request.arrayBuffer()
						: ((
								await base64ToBytes(
									request.url.slice(request.url.indexOf("#") + 1),
								)
							).buffer as ArrayBuffer)
					: undefined,
			);

			return new Response(result, {
				headers: {
					...(procedure.contract.headers || {}),
					...(procedure.contract.output && {
						"Content-Type": "application/octet-stream",
						"Content-Length": `${(result as ArrayBuffer).byteLength}`,
					}),
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
				getProcedureMapKey(
					+(request.method === "GET") as MethodValue,
					new URL(request.url).pathname,
				),
			),
			request,
		);
	};
};

export const universalArrayRouter = (procedures: AnyProcedure[]) => {
	return (request: Request) => {
		return universalHandler(
			findProcedure(
				+(request.method === "GET") as MethodValue,
				new URL(request.url).pathname,
				procedures,
			),
			request,
		);
	};
};
