import type { MethodValue } from "@types";

export const getProcedureMapKey = (method: MethodValue, pathname: string) =>
	`${method}:${pathname}` as `${MethodValue}:${string}`;
