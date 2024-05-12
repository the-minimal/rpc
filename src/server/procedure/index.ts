import type { AnyProtocolType } from "@the-minimal/protocol";
import { decode, encode } from "@the-minimal/protocol";
import type { Optional } from "@the-minimal/types";
import type { ContractOutput, InnerHandler, MethodValue } from "@types";

export const procedure = <
	$Method extends MethodValue,
	$Input extends Optional<AnyProtocolType>,
	$Output extends Optional<AnyProtocolType>,
>(
	contract: ContractOutput<$Method, $Input, $Output>,
	handler: InnerHandler<$Input, $Output>,
) => ({
	contract,
	handler: async (
		value: $Input extends undefined ? undefined : ArrayBuffer,
	): Promise<$Output extends undefined ? undefined : ArrayBuffer> => {
		return contract.output
			? encode(
					contract.output,
					await handler(
						contract.input
							? decode(contract.input, value as ArrayBuffer)
							: (undefined as any),
					),
				)
			: (undefined as any);
	},
});
