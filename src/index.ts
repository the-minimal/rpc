import { createClient } from "./client";
import { procedure } from "./server";
import { Namespaces, Procedures } from "./types";

const article = {
	"query/by-category": procedure(
		null, 
		async (data) => ({ hello: "world" })
	),
	"mutate/create": procedure(
		() => ({}) as { title: string, content: string },
		async (data) => ({ id: "" })
	)
} satisfies Procedures;

const routes = {
	article,
} satisfies Namespaces;

const { query, mutate } = createClient<typeof routes>("localhost:3000");

query("article/by-category", null);
mutate("article/create", { title: "hello", content: "world" });
