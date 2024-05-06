import type { AnyType } from "@the-minimal/protocol";
import type { Contract, Type } from "@types";

export const contract = <
	const $Type extends Type,
	const $Input extends AnyType,
	const $Output extends AnyType,
>(
	contract: Contract<$Type, $Input, $Output>,
) => contract;
