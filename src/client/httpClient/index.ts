import { DEFAULT_CODE, DEFAULT_ERROR } from "@constants";
import type { AnyProtocolType } from "@the-minimal/protocol";
import { decode, encode } from "@the-minimal/protocol";
import type { Optional } from "@the-minimal/types";
import type { ContractOutput, InferType, MethodValue, Result } from "@types";
import { Method } from "@types";
import { bytesToBase64 } from "../bytesToBase64/index.js";

export const httpClient = <
	$Method extends MethodValue,
	$Input extends Optional<AnyProtocolType>,
	$Output extends Optional<AnyProtocolType>,
	$BaseUrl extends string,
>(
	baseUrl: $BaseUrl extends `${string}/` ? never : $BaseUrl,
	contract: ContractOutput<$Method, $Input, $Output>,
) => {
	return async (
		value: InferType<$Input>,
	): Promise<Result<InferType<$Output>>> => {
		try {
			const body = contract.input ? encode(contract.input, value) : undefined;
			const response =
				contract.method === Method.Post
					? await fetch(`${baseUrl}${contract.path}`, {
							method: "POST",
							headers: {
								...contract.headers,
								...(contract.input && {
									"Content-Type": "application/octet-stream",
									"Content-Length": `${(body as ArrayBuffer).byteLength}`,
								}),
							},
							body,
						})
					: await fetch(
							`${baseUrl}${contract.path}${
								contract.input
									? `#${await bytesToBase64(
											new Uint8Array(body as ArrayBuffer),
										)}`
									: ""
							}`,
							{
								headers: contract.headers,
							},
						);

			if (response.ok) {
				return {
					code: response.status,
					data: contract.output
						? decode(contract.output, await response.arrayBuffer())
						: (undefined as any),
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
