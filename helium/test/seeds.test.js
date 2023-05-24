const {
  clearDatabase,
  createUser,
  createTask,
  shareTask,
} = require("../seeds/seeds");

beforeEach(async () => {
  await clearDatabase();
});

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
