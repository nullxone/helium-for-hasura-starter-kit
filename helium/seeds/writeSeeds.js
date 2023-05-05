const { gql } = require("graphql-request");
const { makeQuery } = require("../utils");

const { users, tasks } = require("./seedData");

async function writeSeedData() {
  const data1 = await makeQuery(
    gql`
      mutation (
        $users: [users_insert_input!]!
        $tasks: [tasks_insert_input!]!
      ) {
        insert_users(objects: $users) {
          returning {
            id
          }
        }
        insert_tasks(objects: $tasks) {
          returning {
            id
          }
        }
      }
    `,
    { users, tasks },
    { "X-Hasura-Admin-Secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET }
  );
  console.log(data1.data);
}

writeSeedData();
