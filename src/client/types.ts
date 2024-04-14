import { Procedure, Output, Procedures } from "../types";

export type InferInput<$Procedure> = $Procedure extends Procedure 
	? Parameters<$Procedure["handler"]>[0]
	: never;

export type InferOutput<$Procedure> = $Procedure extends Procedure 
	? ReturnType<$Procedure["handler"]> extends Promise<infer $Value>
		? $Value extends Output<infer $Output>
			? $Output
			: never
		: never
	: never;

export type InferQueries<$Procedures extends Procedures> = {
	[$ProcedureName in keyof $Procedures as $Procedures[$ProcedureName] extends Procedure<"query"> ? $ProcedureName: never]: $Procedures[$ProcedureName];
};

export type InferMutations<$Procedures extends Procedures> = {
	[$ProcedureName in keyof $Procedures as $Procedures[$ProcedureName] extends Procedure<"mutation"> ? $ProcedureName: never]: $Procedures[$ProcedureName];
};
