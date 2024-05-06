import { init } from "@the-minimal/protocol";
import { serve } from "bun";
import { procedure, universalMapRouter } from "../src/index.js";
import { userRegisterContract } from "./contract.js";

const userRegisterProcedure = procedure(userRegisterContract, async () => {
	return {
		id: "test",
	};
});

const callProcedure = universalMapRouter([userRegisterProcedure]);

init();

serve({
	fetch(req) {
		return callProcedure(req);
	},
	port: 3000,
});
