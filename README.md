Minimal RPC library in TypeScript.

# Install

```bash
yarn add @the-minimal/rpc
```

# Example

## Contract

```ts
import { protocolContract } from "@the-minimal/rpc";
import { Name } from "@the-minimal/protocol";
import { and, email, rangeLength } from "@the-minimal/validator";

export const userRegisterContract = protocolContract({
    type: "mutation",
    path: "/user/register",
    input: {
        name: Name.Object,
        value: [
            { 
							key: "email", 
							name: Name.String, 
							assert: and([rangeLength(5, 50), email])
						},
            { 
							key: "password", 
							name: Name.String, 
							assert: rangeLength(8, 16)
						}
        ]
    },
    output: {
        name: Name.Object,
        value: [
            { 
							key: "id", 
							name: Name.String 
						}
        ]
    }
});
```

## Server

```ts
import { serve } from "bun";
import { 
  callProcedure, 
  protocolProcedure, 
  registerProcedures 
} from "@the-minimal/rpc";
import { init } from "@the-minimal/protocol";
import { userRegisterContract } from "@contracts";
import { User } from "@controllers";

const userRegisterProcedure = protocolProcedure(
    userRegisterContract,
    async (value) => {
        if(await User.exists(value.email)) {
          throw new Error("User already exists");
        }

        const user = await User.create(value);

        return {
            id: user.id
        }; 
    }
);

init();

registerProcedures([
    userRegisterProcedure
]);

serve({
  fetch(req) {
    return callProcedure(req);
  },
  port: 3000
});
```

## Client

### Api

```ts
import { init } from "@the-minimal/protocol";
import { protocolClient } from "@the-minimal/rpc";
import { userRegisterContract } from "@contracts";

init();

const API_URL = import.meta.env.API_URL;

const userRegister = protocolClient(
  API_URL, 
  userRegisterContract
);
```

### Component

```sveltehtml
<script lang="ts">
  import { protocolClient } from "@the-minimal/rpc"; 
  import { userRegister } from "@api"; 
  import { Error } from "./Error"; 

  let email = "";
  let password = "";
  let error: string | null = null;
  
  const register = async () => {
    try {
      const result = await userRegister({ 
        email, 
        password 
      });
    } catch (e) {
      error = e.message;
    } 
  };
</script>

<div>
  {#if error}
    <Error message={error} />
  {/if}
  
  <input type="email" bind:value={email} />
  <input type="password" bind:value={password} />
  
  <button on:click={register}>Register</button>
</div>
```
