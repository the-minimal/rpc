export namespace Procedure {
	export enum Type {
		Mutation,
		Query,
	}

	export type New<
		$Type extends Type,
		$Protocol extends Protocol,
		$Input,
		$Output,
	> = {
		contract: Contract<$Type, $Protocol, $Input, $Output>;
		handler: OuterHandler<ProtocolRawMap[$Protocol]>;
	};

	export type Any = New<Type, Protocol, unknown, unknown>;

	export type InnerHandler<$Input, $Output> = (
		value: $Input,
	) => Promise<$Output>;
	export type OuterHandler<$Raw> = (value: $Raw) => Promise<$Raw>;

	export type Headers = Record<string, string>;
}

export enum Protocol {
	Json,
	Binary,
}

export type ProtocolRawMap = {
	[Protocol.Json]: string;
	[Protocol.Binary]: ArrayBuffer;
};

export type Contract<
	$Type extends Procedure.Type,
	$Protocol extends Protocol,
	$Input,
	$Output,
	$Raw = ProtocolRawMap[$Protocol],
> = {
	type: $Type;
	protocol: $Protocol;
	path: string;
	headers: Procedure.Headers;
	input: {
		encode: (value: $Input) => $Raw;
		decode: (value: $Raw) => $Input;
	};
	output: {
		encode: (value: $Output) => $Raw;
		decode: (value: $Raw) => $Output;
	};
};

export type Result<$Value> =
	| {
			code: number;
			data: $Value;
			error: null;
	  }
	| {
			code: number;
			data: null;
			error: string;
	  };
