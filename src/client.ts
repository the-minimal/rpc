import { DEFAULT_CODE, DEFAULT_ERROR } from "./constants";
import { type Contract, Procedure, type Protocol, type Result } from "./types";

export const client =
	<$Protocol extends Protocol>(
		contentType: string,
		method: "json" | "arrayBuffer" | "text" | "blob",
	) =>
	<$Type extends Procedure.Type, $Input, $Output>(
		baseUrl: string,
		contract: Contract<$Type, $Protocol, $Input, $Output>,
	) =>
	async (value: $Input): Promise<Result<$Output>> => {
		try {
			const response = await fetch(`${baseUrl}${contract.path}`, {
				method: contract.type === Procedure.Type.Query ? "GET" : "POST",
				headers: {
					...contract.headers,
					"content-type": contentType,
				},
				body: contract.input.encode(value) as any,
			});

			if (response.ok && response.status >= 200 && response.status <= 299) {
				const raw = await response[method]();
				const decoded = contract.output.decode(raw);

				return {
					code: response.status,
					data: decoded,
					error: null,
				};
			}

			try {
				return {
					code: response.status,
					data: null,
					error: await response.text(),
				};
			} catch {
				return {
					code: response.status,
					data: null,
					error: response.statusText,
				};
			}
		} catch (e) {
			return {
				code: DEFAULT_CODE,
				data: null,
				error: e?.message || DEFAULT_ERROR,
			};
		}
	};
