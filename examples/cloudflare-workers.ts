// rpc.ts
const rpc = {
	article: {
		byCategory: query(articleByCategoryInput, async () => { /* .. */ }),
		create: mutation(articleCreateInput, async () => { /* .. */ }),
	},
	user: {
		all: query(userAllInput, async () => { /* .. */ }),
		removeById: mutation(userRemoveByIdInput, async () => { /* .. */ }),
	}
} satisfies Records<Procedures>;

export type RpcArticle = typeof rpc.article;
export type RpcUser= typeof rpc.user;

// index.ts
export default {
	async fetch(req: Request, res: Response) {
		const url = new URL(req.url);
		const paths = url.pathname.slice(1).split("/");
		const first = paths[0];

		if(first in rpc) {
			try {
				const output = await execute(rpc[first], paths[1], url, req);
				const response = Response.json(output.data ?? {}, { status: 200 });
				
				response.headers.set("content-type", "application/json");

				if(output.headers) {
					for (const key in output.headers) {
						response.headers.set(key, output.headers[key]);
					}
				}

				return response;
			} catch (e) {
				return new Response(
					e?.message || "Something went wrong", 
					{ status: e?.code ?? 500 }
				);
			}
		} else {
			return new Response("RPC not found", { status: 404 });
		}
	}
};
