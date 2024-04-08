TypeScript RPC library with focus on bundle size, runtime performance, type performance and startup performance.

# API

## Server

### Routes

```ts
const article = {
    "query/by-category": procedure(
        object({ category: string(), page: number() }),
        async ({ category, page }) => { /* .. */ }
    ),
    "mutate/create-default": procedure(
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

### Execution

```ts
// Cloudflare Workers
export default {
    async fetch(req: Request, res: Response) {
        return execute(routes, req, res);
    }
}
```

## Client

```ts
import type { Routes } from "server";

const { query, mutate } = createClient(process.env.API_URL);

query("article/by-category", { category: "tech", page: 1 });
mutate("article/create-default", { title: "Hello", category: "tech", content: ".." });
```
