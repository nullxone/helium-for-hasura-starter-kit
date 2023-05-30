const { gql } = require("graphql-request");
const { seedData } = require("../seeds/seedData");
const { clearDatabase } = require("../seeds/seeds");
const {
  makeAdminQuery,
  testLog,
  jsonLog,
  signin,
  makeUserQuery,
} = require("../utils");

beforeEach(async () => {
  await clearDatabase();
});

test("user specific database", async () => {
  const authUsers = await seedData();

  for (let i = 0; i < authUsers.length; i++) {
    const u = authUsers[i];
    testLog(u.name);

    const session = await signin({ email: u.email, password: "1234" });
    const {
      data: { data: tasks },
    } = await makeUserQuery(
      gql`
        query {
          tasks {
            title
          }
        }
      `,
      undefined,
      session.accessToken
    );
    jsonLog(tasks);
  }
});
