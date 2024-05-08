export const getProcedureMapKey = (method: string, pathname: string) =>
	`${method}:${pathname}`;
