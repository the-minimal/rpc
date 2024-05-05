import type { Procedure } from "./types";
import { PROCEDURE_MAP } from "./constants";

export const registerProcedures = (procedures: Procedure.Any[]) => {
	for (let i = 0; i < procedures.length; ++i) {
		PROCEDURE_MAP.set(
			`${procedures[i].contract.type}:${procedures[i].contract.path}`,
			procedures[i],
		);
	}
};
