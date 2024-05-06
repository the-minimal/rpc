import { init } from "@the-minimal/protocol";
import { serve } from "bun";
import { protocolProcedure, universalMapRouter } from "../src";
import { userRegisterContract } from "./contract";

const userRegisterProcedure = protocolProcedure(
	userRegisterContract,
	async () => {
		return {
			id: "test",
		};
	},
);

const callProcedure = universalMapRouter([userRegisterProcedure]);

init();

serve({
	fetch(req) {
		return callProcedure(req);
	},
	port: 3000,
});
