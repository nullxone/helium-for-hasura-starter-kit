const { gql } = require("graphql-request");
const { makeAdminQuery, jsonLog } = require("../utils");
const { seedData } = require("../seeds/seedData");
const {
  clearDatabase,
  createUser,
  createTask,
  shareTask,
} = require("../seeds/seeds");

beforeEach(async () => {
  await clearDatabase();
});

test("query user tasks", async () => {
  await seedData();
  const allData = await makeAdminQuery(
    gql`
      query {
        users {
          name
          tasks {
            title
          }
        }
      }
    `
  );
  jsonLog(allData.data.data);
});

test("query all data", async () => {
  await seedData();
  const allData = await makeAdminQuery(
    gql`
      query {
        users {
          name
          tasks {
            title
            shared_tasks {
              with_user {
                name
              }
            }
          }
          shared_tasks {
            task {
              title
            }
          }
        }
      }
    `
  );
  jsonLog(allData.data.data);
});
