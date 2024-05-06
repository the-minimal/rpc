![RPC image](https://github.com/the-minimal/rpc/blob/main/docs/the-minimal-rpc.jpg?raw=true)

# Highlights

- Small (< 1 KB)
- Low runtime overhead
- Contract-based
- Static type inference
- Protocol: [@the-minimal/protocol](https://github.com/the-minimal/protocol)
  - Binary protocol
  - Schema-based
  - Single pass encode + assert
  - Produces very small payload
  - Small (< 1 KB)
  - Low runtime overhead
- Validation: [@the-minimal/validator](https://github.com/the-minimal/validator)
  - Runtime validations
  - Assertion-only
  - Small (< 1 KB)
  - Low runtime overhead
- Errors: [@the-minimal/error](https://github.com/the-minimal/error)
  - Minimal errors
  - No stack traces
  - Small (~ 120 bytes)
  - Low runtime overhead

# Install

```bash
yarn add @the-minimal/rpc
```

# Example

## Contract

```ts
import { Type, contract } from "@the-minimal/rpc";
import { Name } from "@the-minimal/protocol";
import { and, email, rangeLength } from "@the-minimal/validator";

export const userRegisterContract = contract({
  type: Type.Mutation,
  path: "/user/register",
  input: {
    name: Name.Object,
    value: [
      {
        key: "email",
        name: Name.String,
        assert: and([rangeLength(5, 50), email]),
      },
      {
        key: "password",
        name: Name.String,
        assert: rangeLength(8, 16),
      },
    ],
  },
  output: {
    name: Name.Object,
    value: [
      {
        key: "id",
        name: Name.String,
      },
    ],
  },
});
```

## Server

```ts
import { serve } from "bun";
import { init } from "@the-minimal/protocol";
import { procedure, universalMapRouter } from "@the-minimal/rpc";
import { userRegisterContract } from "@contracts";

const userRegisterProcedure = procedure(
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
```

## Client

### Api

```ts
import { init } from "@the-minimal/protocol";
import { client } from "@the-minimal/rpc";
import { userRegisterContract } from "@contracts";

init();

const userRegister = client(
  import.meta.env.RPC_URL,
  userRegisterContract,
);
```

### Component

```svelte
<script lang="ts">
  import { goto } from "svelte";
  import { userRegister } from "@api"; 
  import { Error } from "./Error"; 

  let email = "";
  let password = "";
  let error: string | null = null;
  
  const register = async () => {
    try {
      await userRegister({ 
        email, 
        password 
      });
      
      goto("/login");
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
