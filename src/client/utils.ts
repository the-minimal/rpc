import { Json, Nullable } from "../types";

export const getSearch = (input: Nullable<Json>) => {
	if(input) {
		const params = new URLSearchParams(input);

		params.sort();

		return params.toString();
	} else {
		return "";
	}
};
