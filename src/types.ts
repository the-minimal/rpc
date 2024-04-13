export type Nullable<$Type> = $Type | null;

export type Maybe<$Type> = $Type | void;

export type Records<$Value = any> = Record<string | number | symbol, $Value>;

export type Namespaces = Records<Procedures>;

export type Procedures = Records<Procedure>;

export type Json = Array<any> | Records;

export type Handler<
	$Input extends Nullable<Records> = any,
	$Output extends Maybe<Json> = any
> = (data: $Input, req: Request) => Promise<Output<$Output> | void>;

export type Input<$Input extends Nullable<Records> = any> = (data: unknown) => asserts data is $Input;

export type Output<$Output extends Maybe<Json> = any> = Partial<{
	data: $Output;
	headers: Records;
}>;

export type Procedure<
	$Type extends "query" | "mutation" = any,
	$Input extends Nullable<Records> = any,
	$Output extends Maybe<Json> = any
> = {
	type: $Type;
	input: Nullable<Input<$Input>>;
	handler: Handler<$Input, $Output>;
};

