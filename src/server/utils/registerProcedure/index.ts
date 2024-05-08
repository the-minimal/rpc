import { PROCEDURE_MAP } from "@constants";
import type { AnyProcedure } from "@types";
import { getProcedureMapKey } from "../getProcedureMapKey/index.js";

export const registerProcedure = (procedures: AnyProcedure[]) => {
	for (let i = 0; i < procedures.length; ++i) {
		PROCEDURE_MAP.set(
			getProcedureMapKey(
				procedures[i].contract.method,
				procedures[i].contract.path,
			),
			procedures[i],
		);
	}
};
