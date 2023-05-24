const { gql } = require("graphql-request");
const {
  makeAdminQuery,
  signup,
  deleteAllAuthUsers,
  jsonLog,
} = require("../utils");

beforeEach(async () => {
  await deleteAllAuthUsers();
  await makeAdminQuery(
    gql`
      mutation {
        delete_shared_tasks(where: {}) {
          affected_rows
        }
        delete_tasks(where: {}) {
          affected_rows
        }
        delete_users(where: {}) {
          affected_rows
        }
      }
    `
  );
});

async function createUser(user) {
  const session = await signup({ ...user, password: "1234" });
  const res = await makeAdminQuery(
    gql`
      mutation create_user {
        user: insert_users_one(object: {id: "${session.user.id}", name: "${user.name}"}) {
          id
        }
      }
    `
  );
  return { id: res.data.data.user.id, ...user };
}

async function createTask(task) {
  const res = await makeAdminQuery(
    gql`
      mutation create_task($task: tasks_insert_input!) {
        task: insert_tasks_one(object: $task) {
          id
          title
          user_id
        }
      }
    `,
    { task: { ...task, body: task.title } }
  );
  return res.data.data.task;
}

async function shareTask(sharedTask) {
  const res = await makeAdminQuery(
    gql`
      mutation create_shared_task($sharedTask: shared_tasks_insert_input!) {
        sharedTask: insert_shared_tasks_one(object: $sharedTask) {
          id
          with_user_id
          task_id
        }
      }
    `,
    { sharedTask }
  );
  return res.data.data.sharedTask;
}

test("test api", async () => {
  const user = await createUser({
    name: "John Doe",
    email: "john.doe@email.com",
  });
  console.log(user);

  const task = await createTask({
    title: "Do the dishes",
    user_id: user.id,
  });
  console.log(task);

  const sharedTask = await shareTask({
    with_user_id: user.id,
    task_id: task.id,
  });
  console.log(sharedTask);
});
