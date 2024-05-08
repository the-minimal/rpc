import type { AnyType } from "@the-minimal/protocol";
import type { Contract, Method } from "@types";

export const contract = <
	const $Method extends Method,
	const $Input extends AnyType,
	const $Output extends AnyType,
>(
	contract: Contract<$Method, $Input, $Output>,
) => contract;
