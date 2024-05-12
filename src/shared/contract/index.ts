import type { AnyProtocolType } from "@the-minimal/protocol";
import type { Maybe } from "@the-minimal/types";
import type { ContractInput, ContractOutput, MethodValue } from "@types";

export const contract = <
	const $Method extends MethodValue,
	const $Input extends Maybe<AnyProtocolType> = undefined,
	const $Output extends Maybe<AnyProtocolType> = undefined,
>(
	contract: ContractInput<$Method, $Input, $Output>,
) => contract as ContractOutput<$Method, $Input, $Output>;
