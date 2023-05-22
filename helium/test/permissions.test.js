const { gql } = require("graphql-request");
const { makeQuery, signup, deleteAllAuthUsers, jsonLog } = require("../utils");

beforeEach(async () => {
  await deleteAllAuthUsers();
});

test("user can create own profile", async () => {
  const user = {
    name: "TEST1",
    email: "test1@email.com",
    password: "1234",
  };
  const session = await signup(user);

  const res = await makeQuery(
    gql`
      mutation create_user {
        insert_users_one(object: {id: "${session.user.id}", name: "${user.name}"}) {
          id, name
        }
      }
    `,
    undefined,
    { Authorization: `Bearer ${session.accessToken}` }
  );

  expect(res.data.data.insert_users_one.name).toBe("TEST1");
});

test("user cannot create another users profile", async () => {
  const user = {
    name: "TEST1",
    email: "test1@email.com",
    password: "1234",
  };
  const session = await signup(user);
  const differentUserId = "2b8e4d4e-bce1-4f55-8ac0-32ec2b1b27bb";

  const res = await makeQuery(
    gql`
      mutation create_user {
        insert_users_one(object: {id: "${differentUserId}", name: "${user.name}"}) {
          id, name
        }
      }
    `,
    undefined,
    { Authorization: `Bearer ${session.accessToken}` }
  );

  expect(res.data.errors[0].extensions.code).toBe("permission-error");
});
