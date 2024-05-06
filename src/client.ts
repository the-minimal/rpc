import { DEFAULT_CODE, DEFAULT_ERROR } from "@constants";
import {
	type AnyType,
	type Infer,
	decode,
	encode,
} from "@the-minimal/protocol";
import { type Contract, type Result, Type } from "@types";

export const client =
	<$Type extends Type, $Input extends AnyType, $Output extends AnyType>(
		baseUrl: string,
		contract: Contract<$Type, $Input, $Output>,
	) =>
	async (value: Infer<$Input>): Promise<Result<Infer<$Output>>> => {
		try {
			const body = encode(contract.input, value);
			const response = await fetch(`${baseUrl}${contract.path}`, {
				method: contract.type === Type.Query ? "GET" : "POST",
				headers: {
					...contract.headers,
					"Content-Type": "application/octet-stream",
					"Content-Length": `${body.byteLength}`,
				},
				body,
			});

			if (response.ok && response.status >= 200 && response.status <= 299) {
				return {
					code: response.status,
					data: decode(contract.output, await response.arrayBuffer()),
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
		} catch (e: any) {
			return {
				code: DEFAULT_CODE,
				data: null,
				error: e?.message ?? DEFAULT_ERROR,
			};
		}
	};
