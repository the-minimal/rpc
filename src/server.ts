import { Namespaces, Nullable, Procedure, Protocol } from "./types";
import { protocolJson } from "./utils";

const searchToProxy = (search: string) => {
	return new Proxy(new URLSearchParams(search), {
		get: (params, prop) => params.get(prop as any),
	});
};

type Validator<$Output> = (value: unknown) => $Output;
type Input = Nullable<Validator<any>>;
type Data<$Input extends Input> = $Input extends Validator<infer $Output> 
	? $Output
	: null;

export const procedure = <
	$Input extends Input, 
	$Handler extends Procedure<$Input, any>
>(
	input: $Input,
	handler: $Handler,
	props: {
		ttl?: Nullable<string | number>,
		protocol?: Protocol
	}
) => ({
	input,
	handler,
	props: {
		ttl: props.ttl ?? 0,
		protocol: props.protocol ?? protocolJson 
	}
});

export const execute = async (routes: Namespaces, req: Request) => {
	const url = new URL(req.url);
	const query = req.method.charCodeAt(0) === 67;
	const paths = url.pathname.slice(1).split("/");
	const namespaceName = paths[0];
	const procedureName = paths[1];

	const key = `${query ? "query": "mutate"}/${procedureName}`;

	if (!namespaceName) {
		throw Error("Namespace not provided");
	} else if (!(namespaceName in routes)) {
		throw Error(`Namespace [${namespaceName}] does not exist`);
	} else if (!procedureName) {
		throw Error("Procedure not provided");
	} else if (!(key in routes[namespaceName])) {
		throw Error(`Procedure [${procedureName}] does not exist`);
	}

	const procedure = routes[namespaceName][key];
	const protocol = procedure.props.protocol;
	const input = procedure.input(query 
		? searchToProxy(url.search)
		: (protocol.decode(await protocol.data(req))
	));
	const output = await procedure.handler(input, req);

	return output;
};
