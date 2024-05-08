import { DEFAULT_CODE, DEFAULT_ERROR, TEXT_DECODER } from "@constants";
import {
	type AnyType,
	type Infer,
	decode,
	encode,
} from "@the-minimal/protocol";
import type { Contract, Method, Result } from "@types";

export const client = <
	$Method extends Method,
	$Input extends AnyType,
	$Output extends AnyType,
>(
	baseUrl: string,
	contract: Contract<$Method, $Input, $Output>,
) => {
	return async (
		value: Infer<$Input>,
		hash?: string,
	): Promise<Result<Infer<$Output>>> => {
		try {
			const body = encode(contract.input, value);
			const response = await fetch(
				`${baseUrl}${contract.path}${
					contract.hash
						? `#${
								hash ??
								TEXT_DECODER.decode(await crypto.subtle.digest("SHA-1", body))
							}`
						: ""
				}`,
				{
					method: contract.method ?? "GET",
					headers: {
						...contract.headers,
						"Content-Type": "application/octet-stream",
						"Content-Length": `${body.byteLength}`,
					},
					body,
				},
			);

			if (response.ok && response.status >= 200 && response.status <= 299) {
				return {
					code: response.status,
					data: decode(contract.output, await response.arrayBuffer()),
					error: null,
				};
			}

			return {
				code: response.status,
				data: null,
				error: await (async () => {
					try {
						return await response.text();
					} catch {
						return !!response.statusText ? response.statusText : DEFAULT_ERROR;
					}
				})(),
			};
		} catch (e: any) {
			return {
				code: DEFAULT_CODE,
				data: null,
				error: !!e?.message ? e.message : DEFAULT_ERROR,
			};
		}
	};
};
