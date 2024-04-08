import { Namespaces, Nullable, Procedure } from "./types";

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
	handler: $Handler
) => {
	return (data: Data<$Input>, req: Request): ReturnType<$Handler> => {
		return handler(input ? input(data): null, req) as any;
	};
};

export const execute = async (routes: Namespaces, req: Request) => {
	const url = new URL(req.url);
	const query = req.method.charCodeAt(0) === 67;
	const paths = url.pathname.slice(1).split("/");
	const namespace = paths[0];
	const procedure = paths[1];

	const key = `${query ? "query": "mutate"}/${procedure}`;

	if (!namespace) {
		throw Error("Namespace not provided");
	} else if (!(namespace in routes)) {
		throw Error(`Namespace [${namespace}] does not exist`);
	} else if (!procedure) {
		throw Error("Procedure not provided");
	} else if (!(key in routes[namespace])) {
		throw Error(`Procedure [${procedure}] does not exist`);
	}

	return (await routes[namespace][key](
		query ? searchToProxy(url.search): (await req.json()),
		req
	));
};
