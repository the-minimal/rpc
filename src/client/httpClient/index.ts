import { DEFAULT_CODE, DEFAULT_ERROR } from "@constants";
import type { AnyType, Infer } from "@the-minimal/protocol";
import { decode, encode } from "@the-minimal/protocol";
import type { Contract, Method, Result } from "@types";
import { bytesToBase64 } from "../bytesToBase64/index.js";

export const httpClient = <
	$Method extends Method,
	$Input extends AnyType,
	$Output extends AnyType,
	$BaseUrl extends string,
>(
	baseUrl: $BaseUrl extends `${string}/` ? never : $BaseUrl,
	contract: Contract<$Method, $Input, $Output>,
) => {
	return async (value: Infer<$Input>): Promise<Result<Infer<$Output>>> => {
		try {
			(contract as any).method ??= "GET";

			const body = encode(contract.input, value);
			const response =
				contract.method === "GET"
					? await fetch(
							`${baseUrl}${contract.path}#${await bytesToBase64(
								new Uint8Array(body),
							)}`,
							{
								headers: contract.headers,
							},
						)
					: await fetch(`${baseUrl}${contract.path}`, {
							method: "POST",
							headers: {
								...contract.headers,
								"Content-Type": "application/octet-stream",
								"Content-Length": `${body.byteLength}`,
							},
							body,
						});

			if (response.ok) {
				return {
					code: response.status,
					data: decode(contract.output, await response.arrayBuffer()),
					error: null,
				};
			}

			return {
				code: response.status,
				data: null,
				error: await response
					.text()
					.then((v) => v || response.statusText || DEFAULT_ERROR)
					.catch(() => response.statusText || DEFAULT_ERROR),
			};
		} catch (e: any) {
			return {
				code: DEFAULT_CODE,
				data: null,
				error: e.message || DEFAULT_ERROR,
			};
		}
	};
};
