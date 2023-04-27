const { gql } = require("graphql-request");

API_URL = "http://localhost:8080/v1/graphql";

async function makeQuery(query, variables, headers = {}) {
  return await fetch("http://localhost:8080/v1/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
}

async function streamToString(stream) {
  // lets have a ReadableStream as a stream variable
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf-8");
}

test("queries without any authn fail", async () => {
  const res = await makeQuery(
    gql`
      query MyQuery {
        tasks {
          id
        }
      }
    `
  );

  expect((await res.json()).errors[0].message).toEqual(
    "x-hasura-admin-secret/x-hasura-access-key required, but not found"
  );
});

test("can query the database", async () => {
  const res = await makeQuery(
    gql`
      query MyQuery {
        tasks {
          id
        }
      }
    `,
    undefined,
    { "X-Hasura-Admin-Secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET }
  );

  expect((await res.json()).data.tasks).not.toBeUndefined();
});
