import { PROCEDURE_MAP } from "@constants";
import type { AnyProcedure } from "@types";

export const registerProcedure = (procedures: AnyProcedure[]) => {
	for (let i = 0; i < procedures.length; ++i) {
		PROCEDURE_MAP.set(
			`${procedures[i].contract.type}:${procedures[i].contract.path}`,
			procedures[i],
		);
	}
};
