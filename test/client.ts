import { init } from "@the-minimal/protocol";
import { protocolClient } from "../src";
import { userRegisterContract } from "./contract";

init();

const userRegister = protocolClient("localhost:3000", userRegisterContract);

(async () => {
	const result = await userRegister({
		email: "yamiteru@icloud.com",
		password: "Test123456",
	});

	console.log(result);
})();
