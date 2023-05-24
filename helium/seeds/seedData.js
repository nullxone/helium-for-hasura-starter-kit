const { makeAdminQuery } = require("../utils");

const {
  clearDatabase,
  createUser,
  createTask,
  shareTask,
} = require("../seeds/seeds");

async function seedData() {
  // user 1
  const u1 = await createUser({
    name: "1. John Doe",
    email: "john.doe@email.com",
  });
  const t11 = await createTask({
    title: "1.1. Do the dishes",
    user_id: u1.id,
  });
  const t12 = await createTask({
    title: "1.2. Do the laundry",
    user_id: u1.id,
  });

  // user 2
  const u2 = await createUser({
    name: "2. Jane Doe",
    email: "jane.doe@email.com",
  });
  const t21 = await createTask({
    title: "2.1. Build a todo app",
    user_id: u2.id,
  });

  // user 3
  const u3 = await createUser({
    name: "3. Bob Smith",
    email: "bob.smith@email.com",
  });
  const t31 = await createTask({
    title: "3.1. Write some code",
    user_id: u3.id,
  });

  // share tasks
  await shareTask({
    with_user_id: u2.id,
    task_id: t11.id,
  });

  return [u1, u2, u3];
}

module.exports = { seedData };
