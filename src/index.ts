import type { Infer, Type } from "@the-minimal/protocol";
import { decode, encode } from "@the-minimal/protocol";

export enum X {
	Query,
	Mutation,
}

type Contract<$Type extends X, $Input, $Output, $Raw> = {
	type: $Type;
	path: string;
	headers: Record<string, string>;
	input: {
		encode: (value: $Input) => $Raw;
		decode: (value: $Raw) => $Input;
	};
	output: {
		encode: (value: $Output) => $Raw;
		decode: (value: $Raw) => $Output;
	};
};

type InnerHandler<$Input, $Output> = (value: $Input) => Promise<$Output>;
type OuterHandler = (request: Request) => Promise<Response>;

type Procedure<$Type extends X, $Input, $Output, $Raw> = {
	contract: Contract<$Type, $Input, $Output, $Raw>;
	handler: OuterHandler;
};

export type AnyProcedure = Procedure<X, any, any, any>;

type ProtocolContract<
	$Type extends X,
	$Input extends Type.Any,
	$Output extends Type.Any,
> = {
	type: $Type;
	path: string;
	headers?: Record<string, string>;
	input: $Input;
	output: $Output;
};

export const protocolContract = <
	const $Type extends X,
	const $Input extends Type.Any,
	const $Output extends Type.Any,
>(
	contract: ProtocolContract<$Type, $Input, $Output>,
): Contract<$Type, Infer<$Input>, Infer<$Output>, ArrayBuffer> => ({
	type: contract.type,
	path: contract.path,
	headers: contract.headers ?? {},
	input: {
		encode: (value) => encode(contract.input, value),
		decode: (value) => decode(contract.input, value),
	},
	output: {
		encode: (value) => encode(contract.output, value),
		decode: (value) => decode(contract.output, value),
	},
});

export const protocolProcedure = <$Type extends X, $Input, $Output>(
	contract: Contract<$Type, $Input, $Output, ArrayBuffer>,
	handler: InnerHandler<$Input, $Output>,
): Procedure<$Type, $Input, $Output, ArrayBuffer> => ({
	contract,
	handler: async (req) => {
		const arrayBuffer = await req.arrayBuffer();
		const decoded = contract.input.decode(arrayBuffer);
		const input = await handler(decoded);
		const encoded = contract.output.encode(input);

		return new Response(encoded, { status: 200 });
	},
});

export const protocolClient =
	<$Type extends X, $Input, $Output>(
		baseUrl: string,
		contract: Contract<$Type, $Input, $Output, ArrayBuffer>,
	) =>
	async (value: $Input) => {
		const response = await fetch(`${baseUrl}${contract.path}`, {
			method: contract.type === X.Query ? "GET" : "POST",
			headers: {
				...contract.headers,
				"content-type": "application/octet-stream",
			},
			body: contract.input.encode(value),
		});

		const arrayBuffer = await response.arrayBuffer();
		const decoded = contract.output.decode(arrayBuffer);

		return decoded;
	};

const PROCEDURE_MAP = new Map<string, AnyProcedure>();

export const registerProcedures = (procedures: AnyProcedure[]) => {
	for (let i = 0; i < procedures.length; ++i) {
		PROCEDURE_MAP.set(
			`${procedures[i].contract.type}:${procedures[i].contract.path}`,
			procedures[i],
		);
	}
};

export const callProcedure = (request: Request) => {
	const url = new URL(request.url);
	const key = `${request.method === "GET" ? X.Query : X.Mutation}:${
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
