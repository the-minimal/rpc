![RPC image](https://github.com/the-minimal/rpc/blob/main/docs/the-minimal-rpc.jpg?raw=true)

# Highlights

- Small (~1.2 KB)
- Low runtime overhead
- Contract-based
- Easily extendable

# Protocols

| Name                                                             | Format        | Contract           | Procedure           | Client           |
|:-----------------------------------------------------------------|:--------------|:-------------------|:--------------------|:-----------------|
| [@the-minimal/protocol](https://github.com/the-minimal/protocol) | `ArrayBuffer` | `protocolContract` | `protocolProcedure` | `protocolClient` |
| JSON                                                             | `string`      | `jsonContract`     | `jsonProcedure`     | `jsonClient`     |

We recommend using `@the-minimal/protocol` for most use cases as this library was made primarily around this protocol.

However, JSON works as well but compared to `@the-minimal/protocol` in theory it doesn't need contracts which have to be
downloaded and parses on client before they can be used which can be seen as a waste of resources for this use-case.

# Install

```bash
yarn add @the-minimal/rpc
```

# Example

## Contract

```ts
import { Procedure, protocolContract } from "@the-minimal/rpc";
import { Name } from "@the-minimal/protocol";
import { and, email, rangeLength } from "@the-minimal/validator";

export const userRegisterContract = protocolContract({
  type: Procedure.Type.Mutation,
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
import { protocolProcedure, universalMapRouter } from "@the-minimal/rpc";
import { userRegisterContract } from "@contracts";

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
```

## Client

### Api

```ts
import { init } from "@the-minimal/protocol";
import { protocolClient } from "@the-minimal/rpc";
import { userRegisterContract } from "@contracts";

init();

const userRegister = protocolClient(
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
