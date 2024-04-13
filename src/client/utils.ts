import { Nullable, Records } from "../types";

export const getSearch = (input: Nullable<Records>) => {
	if(input) {
		const params = new URLSearchParams(input);

		params.sort();

		return params.toString();
	} else {
		return "";
	}
};
