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

module.exports = { makeQuery };
