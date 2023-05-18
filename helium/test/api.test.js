const { gql } = require("graphql-request");
const { makeQuery } = require("../utils");

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
  console.log(JSON.stringify(res.data, null, 2));
});
