import { Name } from "@the-minimal/protocol";
import { and, email, rangeLength } from "@the-minimal/validator";
import { Type, contract } from "../src/index.js";

export const userRegisterContract = contract({
	type: Type.Mutation,
	path: "/user/register",
	input: {
		name: Name.Object,
		value: [
			{
				key: "email",
				name: Name.String,
				assert: and([rangeLength(5, 50), email]),
			},
			{
				key: "password",
				name: Name.String,
				assert: rangeLength(8, 16),
			},
		],
	},
	output: {
		name: Name.Object,
		value: [
			{
				key: "id",
				name: Name.String,
			},
		],
	},
});
