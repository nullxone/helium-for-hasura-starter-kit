const { gql } = require("graphql-request");
const { makeQuery, jsonLog } = require("../utils");

const { users } = require("../seeds/seedData");

test("can query the database with admin secret", async () => {
  const res = await makeQuery(
    gql`
      query MyQuery {
        users(where: { id: { _eq: "${users[0].id}" } }) {
          name
          tasks {
            id
            title
          }
        }
      }
    `,
    undefined,
    { "X-Hasura-Admin-Secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET }
  );

  expect(res.data.data.users).not.toBeUndefined();
  // jsonLog(res.data);
});
