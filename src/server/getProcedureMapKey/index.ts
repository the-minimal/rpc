import type { Method } from "@types";

export const getProcedureMapKey = (method: Method, pathname: string) =>
	`${method}:${pathname}` as `${Method}:${string}`;
