import { Records } from "../types";

export const searchToProxy = (search: string) => {
	return new Proxy(new URLSearchParams(search), {
		get: (params, prop) => params.get(prop as any),
	}) as Records;
};
