import { Type } from "@the-minimal/protocol";
import { expect, rangeLength } from "@the-minimal/validator";
import { Method } from "@types";
import { procedure } from "./server/index.js";
import { contract } from "./shared/index.js";

export const userRegisterContract = contract({
	method: Method.Post,
	path: "/user/register",
	input: {
		type: Type.Object,
		value: [
			{
				key: "email",
				type: Type.String,
				assert: expect(rangeLength(5, 50), () => "Email"),
			},
			{
				key: "password",
				type: Type.String,
				assert: expect(rangeLength(8, 16), () => "Password"),
			},
		],
	},
	output: {
		type: Type.Object,
		value: [{ key: "id", type: Type.String }],
	},
});

export const userRegisterContractNoAssert = contract({
	method: Method.Post,
	path: "/user/register",
	input: {
		type: Type.Object,
		value: [
			{ key: "email", type: Type.String },
			{ key: "password", type: Type.String },
		],
	},
	output: {
		type: Type.Object,
		value: [{ key: "id", type: Type.String }],
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
	method: Method.Post,
	path: "/user/login",
	input: {
		type: Type.Object,
		value: [
			{ key: "email", type: Type.String, assert: rangeLength(5, 50) },
			{ key: "password", type: Type.String, assert: rangeLength(8, 16) },
		],
	},
	output: {
		type: Type.Object,
		value: [{ key: "token", type: Type.String }],
	},
});

export const userLoginProcedure = procedure(userLoginContract, async () => {
	return {
		token: "hello",
	};
});
