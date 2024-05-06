import type { AnyProcedure, Type } from "@types";

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
