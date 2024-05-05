import type { Contract, Procedure } from "../types";

export const protocolProcedure = <
	$Type extends Procedure.Type, 
	$Input, 
	$Output
>(
	contract: Contract<$Type, $Input, $Output, ArrayBuffer>,
	handler: Procedure.InnerHandler<$Input, $Output>,
): Procedure.New<$Type, $Input, $Output, ArrayBuffer> => ({
	contract,
	handler: async (req) => {
		const arrayBuffer = await req.arrayBuffer();
		const decoded = contract.input.decode(arrayBuffer);
		const input = await handler(decoded);
		const encoded = contract.output.encode(input);

		return new Response(encoded, { status: 200 });
	},
});
