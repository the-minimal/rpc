import { Name } from "@the-minimal/protocol";
import { expect, rangeLength } from "@the-minimal/validator";
import { contract } from "./contract/index.js";
import { procedure } from "./procedure/index.js";

export const userRegisterContract = contract({
	method: "POST",
	path: "/user/register",
	input: {
		name: Name.Object,
		value: [
			{
				key: "email",
				name: Name.String,
				assert: expect(rangeLength(5, 50), () => "Email"),
			},
			{
				key: "password",
				name: Name.String,
				assert: expect(rangeLength(8, 16), () => "Password"),
			},
		],
	},
	output: {
		name: Name.Object,
		value: [{ key: "id", name: Name.String }],
	},
});

export const userRegisterContractNoAssert = contract({
	method: "POST",
	path: "/user/register",
	input: {
		name: Name.Object,
		value: [
			{ key: "email", name: Name.String },
			{ key: "password", name: Name.String },
		],
	},
	output: {
		name: Name.Object,
		value: [{ key: "id", name: Name.String }],
	},
});

export const userRegisterProcedure = procedure(
	userRegisterContract,
	async () => {
		return {
			id: "1234567890",
		};
	},
);

export const userLoginContract = contract({
	method: "POST",
	path: "/user/login",
	input: {
		name: Name.Object,
		value: [
			{ key: "email", name: Name.String, assert: rangeLength(5, 50) },
			{ key: "password", name: Name.String, assert: rangeLength(8, 16) },
		],
	},
	output: {
		name: Name.Object,
		value: [{ key: "token", name: Name.String }],
	},
});

export const userLoginProcedure = procedure(userLoginContract, async () => {
	return {
		token: "hello",
	};
});
