![RPC image](https://github.com/the-minimal/rpc/blob/main/docs/the-minimal-rpc.jpg?raw=true)

Minimal and highly opinionated TypeScript RPC library with binary protocol and data validation.

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

<details open>
  <summary><b>Contract</b></summary>

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

</details>

<details>
  <summary><b>Server</b></summary>

  ```ts
  import { serve } from "bun";
  import { init } from "@the-minimal/protocol";
  import { procedure, universalMapRouter } from "@the-minimal/rpc";
  import { userRegisterContract } from "@contracts";

  const userRegisterProcedure = procedure(
    userRegisterContract,
    async (value) => {
      // ..
      
      return {
        id: user.id,
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

</details>

<details>
  <summary><b>Client - API</b></summary>

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

</details>

<details>
  <summary><b>Client - Component</b></summary>

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

</details>

# API

## Contract

Contract is a declaration of how client and server communicate with each other.

- `type` is `Type.Query` for cacheable requests and `Type.Mutation` for non-cacheable requests
- `path` is the path of the request
- `input` and `output` are [@the-minimal/protocol](https://github.com/the-minimal/protocol) schemas

Contracts are passed into `procedure` and `client`.

```ts
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

## Procedure

Procedure defines how to handle a contract on the server side.

It accepts decoded and verified value and returns a value that is encoded and verified and then sent back to the client.

Procedures are called by routers on request.

```ts
const userRegisterProcedure = procedure(
  userRegisterContract,
  async (value) => {
    // ..
    
    return {
      id: user.id,
    };
  },
);
```

## Client

Client is a wrapper around fetch that handles encoding and decoding of the request and response.

It accepts a base url and a contract and returns a function that accepts a value and returns a promise that resolves
with `Response`.

```ts
const userRegister = client(
  import.meta.env.RPC_URL,
  userRegisterContract,
);

// ..

const user = await userRegister({
  email: "yamiteru@icloud.com",
  password: "Test123456"
});
```

## Router

There are multiple routers for different runtimes and frameworks.

### UniversalMapRouter

Supports any runtime and framework that uses the standard `Request` and `Response` API.

This router is useful for long-running runtimes (e.g. Node, Bun, Deno) since it caches procedures into a `Map` for a fast lookup.

It returns a function which accepts a `Request` and returns a `Promise<Response>`.

```ts
const callProcedure = universalMapRouter([userRegisterProcedure]);

serve({
  fetch(req) {
    return callProcedure(req);
  },
  port: 3000,
});
```

### UniversalArrayRouter

Supports any runtime and framework that uses the standard `Request` and `Response` API.

This router is useful for short-running runtimes (e.g. CloudFlare Workers) since it doesn't cache procedures and instead directly filters the input `AnyProcedure[]`.

It returns a function which accepts a `Request` and returns a `Promise<Response>`.

```ts
const callProcedure = universalArrayRouter([userRegisterProcedure]);

serve({
  fetch(req) {
    return callProcedure(req);
  },
  port: 3000,
});
```