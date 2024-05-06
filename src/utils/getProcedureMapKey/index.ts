import { getProcedureTypeFromMethod } from "../getProcedureTypeFromMethod/index.js";

export const getProcedureMapKey = (method: string, pathname: string) =>
	`${getProcedureTypeFromMethod(method)}:${pathname}`;
