const { gql } = require("graphql-request");
const axios = require("axios");

async function makeQuery(query, variables, headers = {}) {
  return axios.post(
    process.env.HASURA_GRAPHQL_GRAPHQL_URL,
    { query, variables },
    {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    }
  );
}

async function makeAdminQuery(query, variables, headers = {}) {
  return makeQuery(query, variables, {
    ...headers,
    "X-Hasura-Admin-Secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET,
  });
}

async function makeUserQuery(query, variables, jwtToken, headers = {}) {
  return makeQuery(query, variables, {
    ...headers,
    Authorization: `Bearer ${jwtToken}`,
  });
}

async function deleteAllAuthUsers() {
  return makeAdminQuery(
    gql`
      mutation {
        deleteAuthUsers(where: {}) {
          affected_rows
        }
      }
    `,
    undefined
  );
}

function authUrl(path) {
  return `${process.env.AUTH_SERVER_URL}${path}`;
}

async function signup({ email, password }) {
  const res = await axios.post(authUrl("/signup/email-password"), {
    email,
    password,
  });

  return res.data.session;
}

function jsonLog(data) {
  console.log(JSON.stringify(data, null, 2));
}

module.exports = {
  makeQuery,
  makeAdminQuery,
  makeUserQuery,
  signup,
  deleteAllAuthUsers,
  jsonLog,
};
