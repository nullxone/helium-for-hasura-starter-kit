const { gql } = require("graphql-request");
const { makeQuery } = require("../utils");
const axios = require("axios");

const { users } = require("../seeds/seedData");

async function streamToString(stream) {
  // lets have a ReadableStream as a stream variable
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf-8");
}

async function deleteAllAuthUsers() {
  return makeQuery(
    gql`
      mutation {
        deleteAuthUsers(where: {}) {
          affected_rows
        }
      }
    `,
    undefined,
    { "X-Hasura-Admin-Secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET }
  );
}

beforeEach(async () => {
  await deleteAllAuthUsers();
});

function authUrl(path) {
  return `${process.env.AUTH_SERVER_URL}${path}`;
}

async function signup({ name, email, password }) {
  const res = await axios.post(authUrl("/signup/email-password"), {
    email,
    password,
  });

  const session = res.data.session;

  await makeQuery(
    gql`
    mutation create_user {
      insert_users_one(object: {id: "${session.user.id}", name: "${name}"}) {
        id
      }
    }
  `,
    undefined,
    { "X-Hasura-Admin-Secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET }
  );

  return session;
}

async function signin({ email, password }) {
  return axios.post(authUrl("/signin/email-password"), { email, password });
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

  expect(res.data.errors[0].message).toEqual(
    //"x-hasura-admin-secret/x-hasura-access-key required, but not found"
    "Missing 'Authorization' or 'Cookie' header in JWT authentication mode"
  );
});

test("can query the database with admin secret", async () => {
  const res = await makeQuery(
    gql`
      query MyQuery {
        users {
          tasks {
            id
          }
        }
      }
    `,
    undefined,
    { "X-Hasura-Admin-Secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET }
  );

  expect(res.data.data.users).not.toBeUndefined();
});

test("user can update own profile", async () => {
  const session = await signup({
    name: "TEST1",
    email: "test1@email.com",
    password: "1234",
  });

  const res = await makeQuery(
    gql`
      mutation {
        update_users_by_pk(pk_columns: {id: "${session.user.id}"}, _set: {name: "CHANGED"}) {
          id
          name
        }
      }
    `,
    undefined,
    { Authorization: `Bearer ${session.accessToken}` }
  );

  expect(res.data.data.update_users_by_pk.name).toBe("CHANGED");
});

test("user cannot update another users profile", async () => {
  const session = await signup({
    name: "TEST1",
    email: "test1@email.com",
    password: "1234",
  });

  const res = await makeQuery(
    gql`
      mutation {
        update_users_by_pk(pk_columns: {id: "${users[0].id}"}, _set: {name: "CHANGED"}) {
          id
          name
        }
      }
    `,
    undefined,
    { Authorization: `Bearer ${session.accessToken}` }
  );

  expect(res.data.data.update_users_by_pk).toBeNull();
});
