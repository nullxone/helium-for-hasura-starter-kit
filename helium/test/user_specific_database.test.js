const { gql } = require("graphql-request");
const { seedData } = require("../seeds/seedData");
const { clearDatabase } = require("../seeds/seeds");
const { makeAdminQuery, jsonLog, signin, makeUserQuery } = require("../utils");

beforeEach(async () => {
  await clearDatabase();
});

test("user specific database", async () => {
  const authUsers = await seedData();

  for (let i = 0; i < authUsers.length; i++) {
    const u = authUsers[i];
    console.log(u.name);

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
