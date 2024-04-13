Minimal RPC in TypeScript.

# Install

```bash
yarn add @the-minimal/rpc
```

---

# Features

- **Agnostic**
    - Runtime
    - Framework
- **Simple**
    - 4 server functions
    - 1 client function
- **Small**
    - 500 bytes server bundle
    - 250 bytes client bundle
- **Fast**
    - Parsing
    - Initialization
    - Runtime execution
    - Type checking
- **2 levels of nesting**
    - Namespace
    - Procedure
- **2 types of procedures**
    - Query for cacheable requests
    - Mutation for everything else
- **No automatic batching**
- **No middleware chaining**
- **No code generation**
- **No dependencies**

---

# API

## Server

### Define

```ts
import { query, mutation } from "@the-minimal/rpc/server";

const article = {
    "by-category": query(
        object({ category: string(), page: number() }),
        async ({ category, page }) => { /* .. */ },
    ),
    "create-default": mutation(
        object({
            title: string(),
            category: string(),
            content: string()
        }),
        async (article) => { /* .. */ }
    )
} satisfies Procedures;

const routes = {
    article
} satisfies Namespaces;

export type Routes = typeof routes;
```

### Execute

```ts
import { execute } from "@the-minimal/rpc/server";

// Cloudflare Workers
export default {
    async fetch(req: Request, res: Response) {
        try {
            const { data, headers } = execute(routes, req);
            const response = Response.json(data);

            if (headers) {
                const keys = Object.keys(headers);

                for (let i = 0; i < keys.length; ++i) {
                    response.headers.set(keys[i], headers[keys[i]]);
                }
            }

            return response;
        } catch (e) {
            return new Response(
                e?.code ?? 500, 
                e?.message ?? "Something went wrong"
            );
        }
    }
}
```

## Client

```ts
import { createHttpClient } from "@the-minimal/rpc/client";
import type { Routes } from "server";

const { query, mutate } = createHttpClient(process.env.API_URL);
const { signal } = new AbortController();

query("article/by-category", { category: "tech", page: 1 }, signal);
mutate("article/create-default", { title: "Hello", category: "tech", content: ".." }, signal);
```
