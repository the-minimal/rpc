import type { AnyType } from "@the-minimal/protocol";
import type { Contract, MethodValue } from "@types";

export const contract = <
	const $Method extends MethodValue,
	const $Input extends AnyType,
	const $Output extends AnyType,
>(
	contract: Contract<$Method, $Input, $Output>,
) => contract;
