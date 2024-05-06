import { PROCEDURE_MAP } from "@constants";
import type { AnyProcedure, Type } from "@types";

export const getProcedureTypeFromMethod = (method: string) =>
	+(method.charCodeAt(0) === 71) as Type;

export const getProcedureMapKey = (method: string, pathname: string) =>
	`${getProcedureTypeFromMethod(method)}:${pathname}`;

export const registerProcedure = (procedures: AnyProcedure[]) => {
	for (let i = 0; i < procedures.length; ++i) {
		PROCEDURE_MAP.set(
			`${procedures[i].contract.type}:${procedures[i].contract.path}`,
			procedures[i],
		);
	}
};

export const findProcedure = (
	type: Type,
	pathname: string,
	procedures: AnyProcedure[],
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
