import type { Type } from "@types";

export const getProcedureTypeFromMethod = (method: string) =>
	+(method.charCodeAt(0) === 71) as Type;
