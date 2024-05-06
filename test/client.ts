import { init } from "@the-minimal/protocol";
import { protocolClient } from "../src/index.js";
import { userRegisterContract } from "./contract.js";

init();

const userRegister = protocolClient(
	"http://localhost:3000",
	userRegisterContract,
);

(async () => {
	const result = await userRegister({
		email: "yamiteru@icloud.com",
		password: "Test123456",
	});

	console.log(result);
})();
