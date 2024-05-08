![RPC image](https://github.com/the-minimal/rpc/blob/main/docs/the-minimal-rpc.jpg?raw=true)

Experience lightning-fast data transfers and bulletproof validation with this tiny TypeScript RPC library, harnessing ones-and-zeroes for streamlined and secure back-to-back development.

# Highlights

- Small bundle (< 1 KB)
- Low runtime overhead
- Contract based
- Static type inference
- Protocol: [@the-minimal/protocol](https://github.com/the-minimal/protocol)
  - Binary protocol
  - Schema-based
  - Single pass encode/decode + assert
  - Produces very small payload
  - Small bundle (< 1 KB)
  - Low runtime overhead
- Validation: [@the-minimal/validator](https://github.com/the-minimal/validator)
  - Runtime validations
  - Assertion-only
  - Small bundle (< 1 KB)
  - Low runtime overhead
- Errors: [@the-minimal/error](https://github.com/the-minimal/error)
  - Minimal errors
  - No stack traces
  - Small bundle (~ 120 bytes)
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

# FAQ

<details>
  <summary><b>Why binary protocol?</b></summary>

  JSON is a text-based and human-readable protocol which is good for things like config files but suboptimal for transferring data between potentially low-end device on a potentially slow connection.

  Most binary protocols that support TypeScript come with their own DSL which then compiles into, often, quite big JavaScript files.

  Compared to statically typed compiled languages JavaScript and by extension TypeScript has a unique challenge of checking 
  types at runtime.

  Usually this results in a combination of JSON from which we cannot (easily) generate TypeScript types and assert basic types and a runtime data validation library that asserts the basic types together with also asserting some of their properties such as length of a string or comparing number ranges.

  This means that the runtime has to encode and decode unknown data and after that assert it by looping through it again.

  All of this is quite inefficient from the point of view of cpu, ram and payload size.

  Instead, we use a binary schema-full protocol which packs the data into binary and asserts the data while doing so and it does that in a very efficient way.

  This of course assumes that the device makes at least a couple of requests to make up for the initial penalty of downloading and parsing the schema (`contract`) itself. 

  In other words if, on average, you make only one request per one endpoint per one session, then it's probably better to use JSON and a simple and laser-focused, most likely handwritten, assertions.
</details>

<details>
  <summary><b>Why does GET request use body?</b></summary>

  Technically speaking sending body in any kind of request is not an issue.

  However, in GET requests it's very rarely used and the HTTP specification says that in most cases we should not use it.

  If we agreed to not use body in GET requests we would have to use query parameters and/or URL pathname instead which means that we would have to change how we either define contracts or how we parse them increasing complexity and maybe introducing potential parsing bugs that would happen only in some contracts but not others. 

  The main reason users might want to use GET requests as opposed to let's say POST requests is caching.

  It's possible to cache POST requests but in most cases it's not the default behavior and would require some additional work.

  Also in some not-so-rare cases (imagine getting a list of products based on a complex filter) we might hit the URL
  length limit and in that case we would have to use POST requests or somehow either split the URL into multiple parts
  or make the query parameters smaller.

  Because of these reasons we use body in GET requests in tandem with SHA-1 hash, created from the body `ArrayBuffer`, inserted into the URL of the request (format: `${root}${path}#${hash}`).

  By default, hashing is disabled, but you can enable it by setting `hash: true` in the contract.

  Also, if creating SHA-1 hash is too slow or unnecessary in your use-case you can simply pass your custom hash when calling 
  the procedure as the second argument.
</details>

<details>
  <summary><b>How do I cache requests?</b></summary>

  If you use GET method it uses the default caching behavior of the browser.

  If you need a custom behavior you can simply set cache headers in the contract.
</details>

<details>
  <summary><b>How do I use middlewares?</b></summary>

  Essentially middlewares are just functions that are called before and/or after the procedure.

  So instead of doing something like this:

  ```ts
  const router = new Router();
  
  router.before(middleOne); 
  router.before(middleTwo); 
  router.after(middleThree); 
  
  // ..
  
  router.add("/your/endpoint", async (value) => { /* .. */ }); 
  ```

  Do something like this instead:

  ```ts
  const yourEndpointProcedure = procedure(contract, async (value) => {
    await middleOne(value); 
    await middleThree(value); 
    
    // ..
    
    await middleThree(result); 
    
    return result;
  });
  ```

  Obviously if you repeat the same middleware multiple times you should probably wrap it into a function which accept a handler function and use that as the procedure handler instead.

</details>

<details>
  <summary><b>How do I pass context into handler?</b></summary>

  In the spirit of the previous question you can either return context from your middlewares or create `AsyncLocalStorage` outside of 
  the procedure and then use it in whichever procedure and however deep you want.
</details>

# API

## Contract

Contract is a declaration of how client and server communicate with each other.

- `path` = `Request` path
- `method` = `Request` method
- `headers` = `Request` headers
- `hash` = whether to include hash in URL
- `input`/`output` = [@the-minimal/protocol](https://github.com/the-minimal/protocol) schemas

Contracts are passed into `procedure` and `client`.

```ts
export const userRegisterContract = contract({
  method: "POST",
  hash: false,
  headers: {},
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

It accepts decoded value and returns an encoded value which is then sent back to the client.

Procedures are called composed into an array of procedures which is used by routers.

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

Client is a wrapper around fetch that handles encoding and decoding of the `Request` and `Response`.

It accepts a base url and a contract and returns a function that accepts a value and optionally a custom hash and returns a promise that resolves
with `Result`.

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
