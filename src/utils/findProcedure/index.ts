import type { AnyProcedure } from "@types";

export const findProcedure = (
	method: string,
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
