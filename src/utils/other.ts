import { PROCEDURE_MAP } from "@constants";
import type { Procedure } from "@types";

export const getProcedureTypeFromMethod = (method: string) =>
	+(method.charCodeAt(0) === 71) as Procedure.Type;

export const getProcedureMapKey = (method: string, pathname: string) =>
	`${getProcedureTypeFromMethod(method)}:${pathname}`;

export const registerProcedure = (procedures: Procedure.Any[]) => {
	for (let i = 0; i < procedures.length; ++i) {
		PROCEDURE_MAP.set(
			`${procedures[i].contract.type}:${procedures[i].contract.path}`,
			procedures[i],
		);
	}
};

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
