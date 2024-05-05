import type { Contract } from "../types";
import { Procedure } from "../types";
import type { Result } from "./types";

export const protocolClient = <
	$Type extends Procedure.Type, 
	$Input, 
	$Output
>(
	baseUrl: string,
	contract: Contract<$Type, $Input, $Output, ArrayBuffer>,
) => async (value: $Input): Promise<Result<$Output>> => {
	const response = await fetch(`${baseUrl}${contract.path}`, {
		method: contract.type === Procedure.Type.Query ? "GET" : "POST",
		headers: {
			...contract.headers,
			"content-type": "application/octet-stream",
		},
		body: contract.input.encode(value),
	});

	console.log(response);

	if(response.ok && response.status >= 200 && response.status <= 299) {
		const arrayBuffer = await response.arrayBuffer();
		const decoded = contract.output.decode(arrayBuffer);

		return { 
			code: response.status, 
			data: decoded, 
			error: null 
		};
	}

	return { 
		code: response.status, 
		data: null, 
		error: response.statusText 
	};
};
