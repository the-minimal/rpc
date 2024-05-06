import type { Procedure } from "./types.js";

export const getProcedureTypeFromMethod = (method: string) =>
	+(method.charCodeAt(0) === 71) as Procedure.Type;

export const getProcedureMapKey = (method: string, pathname: string) =>
	`${getProcedureTypeFromMethod(method)}:${pathname}`;

export const findProcedure = (
	type: Procedure.Type,
	pathname: string,
	procedures: Procedure.Any[],
) => {
	for (let i = 0; i < procedures.length; ++i) {
		if (
			procedures[i].contract.type === type &&
			procedures[i].contract.path === pathname
		) {
			return procedures[i];
		}
	}
};
