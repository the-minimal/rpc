import type { AnyProcedure, MethodValue } from "@types";

export const findProcedure = (
	method: MethodValue,
	pathname: string,
	procedures: AnyProcedure[],
) => {
	for (let i = 0; i < procedures.length; ++i) {
		if (
			procedures[i].contract.method === method &&
			procedures[i].contract.path === pathname
		) {
			return procedures[i];
		}
	}
};
