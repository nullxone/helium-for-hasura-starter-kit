const {
  clearDatabase,
  createUser,
  createTask,
  shareTask,
} = require("../seeds/seeds");

const { testLog } = require("../utils");

beforeEach(async () => {
  await clearDatabase();
});

test("test api", async () => {
  const user = await createUser({
    name: "John Doe",
    email: "john.doe@email.com",
  });
  testLog(user);

  const task = await createTask({
    title: "Do the dishes",
    user_id: user.id,
  });
  testLog(task);

  const sharedTask = await shareTask({
    with_user_id: user.id,
    task_id: task.id,
  });
  testLog(sharedTask);
});
