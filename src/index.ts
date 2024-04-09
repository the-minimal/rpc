import { createHttpClient } from "./client";
import { procedure } from "./server";
import { Namespaces, Procedures } from "./types";

const article = {
	"by-category": procedure(
		null, 
		async (data) => ({ hello: "world" })
	),
	"create": procedure(
		() => ({}) as { title: string, content: string },
		async (data) => ({ id: "" })
	)
} satisfies Procedures;

const routes = {
	article,
} satisfies Namespaces;

const { query, mutate } = createHttpClient<typeof routes>("localhost:3000");

query("article/by-category", null);
mutate("article/create", { title: "hello", content: "world" });
