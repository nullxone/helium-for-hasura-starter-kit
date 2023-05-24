const { gql } = require("graphql-request");
const { makeQuery, jsonLog } = require("../utils");

const { users } = require("../seeds/seedData");

test.skip("simple query 1", async () => {
  const res = await makeQuery(
    gql`
      query tasks_2023 {
        tasks(where: { created_at: { _gte: "2023-01-01" } }) {
          user {
            name
          }
        }
      }
    `,
    undefined,
    { "X-Hasura-Admin-Secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET }
  );

  jsonLog(res.data);
  // expect(res.data.data.users).not.toBeUndefined();
});

test.skip("simple query 2", async () => {
  const res = await makeQuery(
    gql`
      mutation transfer_tasks {
        update_tasks(where: { user_id: { _eq: 3 } }, _set: { user_id: 4 }) {
          returning {
            id
          }
        }
      }
    `,
    undefined,
    { "X-Hasura-Admin-Secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET }
  );

  jsonLog(res.data);
  // expect(res.data.data.users).not.toBeUndefined();
});

test.skip("advanced query example", async () => {
  const res = await makeQuery(
    gql`
      query MyQuery {
        users(
          where: { tasks_aggregate: { count: { predicate: { _gt: 4 } } } }
        ) {
          name
          tasks_aggregate {
            aggregate {
              count
            }
          }
          tasks(
            where: { created_at: { _gte: "2023-01-01" } }
            order_by: { created_at: desc }
            limit: 3
          ) {
            id
            title
          }
        }
      }
    `,
    undefined,
    { "X-Hasura-Admin-Secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET }
  );

  jsonLog(res.data);
  // expect(res.data.data.users).not.toBeUndefined();
});
