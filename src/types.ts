import type { AnyProtocolType, Infer } from "@the-minimal/protocol";
import type { Maybe } from "@the-minimal/types";

export const Method = {
	Post: 0,
	Get: 1,
} as const;

export type MethodValue = (typeof Method)[keyof typeof Method];
export type Method = typeof Method;

export type Procedure<
	$Method extends MethodValue,
	$Input extends Maybe<AnyProtocolType>,
	$Output extends Maybe<AnyProtocolType>,
> = {
	contract: ContractInput<$Method, $Input, $Output>;
	handler: OuterHandler<$Input, $Output>;
};

export type AnyProcedure = Procedure<any, any, any>;

export type InnerHandler<
	$Input extends Maybe<AnyProtocolType>,
	$Output extends Maybe<AnyProtocolType>,
> = (
	value: $Input extends undefined ? undefined : Infer<$Input>,
) => Promise<$Output extends undefined ? undefined : Infer<$Output>>;

export type OuterHandler<
	$Input extends Maybe<AnyProtocolType>,
	$Output extends Maybe<AnyProtocolType>,
> = (
	value: $Input extends undefined ? undefined : ArrayBuffer,
) => Promise<$Output extends undefined ? undefined : ArrayBuffer>;

export type Headers = Record<string, string>;

export type Path<$Value extends string> = `/${$Value}`;

export type AnyPath = Path<string>;

export type ContractInput<
	$Method extends MethodValue,
	$Input extends Maybe<AnyProtocolType>,
	$Output extends Maybe<AnyProtocolType>,
> = {
	path: AnyPath;
	method?: $Method;
	headers?: Headers;
	input?: $Input;
	output?: $Output;
};

export type ContractOutput<
	$Method extends MethodValue,
	$Input extends Maybe<AnyProtocolType>,
	$Output extends Maybe<AnyProtocolType>,
> = {
	path: AnyPath;
	method: $Method;
	headers?: Headers;
	input: $Input;
	output: $Output;
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

export type InferType<$Type extends Maybe<AnyProtocolType>> =
	$Type extends undefined ? undefined : Infer<$Type>;
