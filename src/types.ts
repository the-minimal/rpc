import type { AnyType, Infer } from "@the-minimal/protocol";

export const Method = {
	Post: 0,
	Get: 1,
} as const;

export type MethodValue = (typeof Method)[keyof typeof Method];
export type Method = typeof Method;

export type Procedure<
	$Method extends MethodValue,
	$Input extends AnyType,
	$Output extends AnyType,
> = {
	contract: Contract<$Method, $Input, $Output>;
	handler: OuterHandler;
};

export type AnyProcedure = Procedure<any, any, any>;

export type InnerHandler<$Input extends AnyType, $Output extends AnyType> = (
	value: Infer<$Input>,
) => Promise<Infer<$Output>>;

export type OuterHandler = (value: ArrayBuffer) => Promise<ArrayBuffer>;

export type Headers = Record<string, string>;

export type Path<$Value extends string> = `/${$Value}`;

export type AnyPath = Path<string>;

export type Contract<
	$Method extends MethodValue,
	$Input extends AnyType,
	$Output extends AnyType,
> = {
	method?: $Method;
	headers?: Headers;
	path: AnyPath;
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
