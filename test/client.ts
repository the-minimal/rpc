import { init } from "@the-minimal/protocol";
import { client } from "../src/index.js";
import { userRegisterContract } from "./contract.js";

init();

const userRegister = client("http://localhost:3000", userRegisterContract);

(async () => {
	const result = await userRegister({
		email: "yamiteru@icloud.com",
		password: "Test123456",
	});

	console.log(result);
})();
