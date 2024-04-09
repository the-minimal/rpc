Minimal RPC in TypeScript.

# Install

```bash
yarn add @the-minimal/rpc
```

---

# Features

- Agnostic
    - Runtime
    - Framework
- Simple
    - 3 server functions
    - 1 client function
- Small
    - x kB server bundle
    - x kB client bundle
- Fast
    - Parsing
    - Initialization
    - Runtime execution
    - Type checking
- 2 levels of nesting
    - Namespace
    - Procedure
- 2 types of procedures
    - Query for cacheable requests
    - Mutation for anything else
- No automatic batching
- No middleware chaining
- No code generation
- No dependencies

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
        { ttl: 3600 }
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
            const { data, ttl = 0 } = execute(routes, req);
            const response = Response.json(data);

            if (ttl) {
                response.headers.set("cache-control", `max-age${ttl ? `=${ttl}`: ""}`);
            }

            return response;
        } catch (e) {
            return new Response(500, e?.message || "Something went wrong");
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

query("article/by-category", { category: "tech", page: 1 }, { signal });
mutate("article/create-default", { title: "Hello", category: "tech", content: ".." }, { signal });
```
