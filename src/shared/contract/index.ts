import type { AnyType } from "@the-minimal/protocol";
import type { Optional } from "@the-minimal/types";
import type { ContractInput, ContractOutput, MethodValue } from "@types";

export const contract = <
	const $Method extends MethodValue,
	const $Input extends Optional<AnyType> = undefined,
	const $Output extends Optional<AnyType> = undefined,
>(
	contract: ContractInput<$Method, $Input, $Output>,
) => contract as ContractOutput<$Method, $Input, $Output>;
