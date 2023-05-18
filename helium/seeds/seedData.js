const users = [
  {
    id: "20388f23-f70d-4c6d-86c3-b34d9b2d8280",
    name: "John Doe",
  },
  {
    id: "67a12702-fc96-49df-8295-1bd6303aa557",
    name: "Jane Doe",
  },
];

const tasks = [
  {
    id: "f63e724c-b297-4379-a76b-27029fcefcb1",
    title: "Task 1",
    body: "Task 1 body",
    user_id: users[0].id,
  },
  {
    id: "d3896006-5d9a-4094-818c-f8ab0994dac6",
    title: "Task 2",
    body: "Task 2 body",
    user_id: users[0].id,
  },
  {
    id: "d3ef7d45-75f5-410e-b290-66a5a4716757",
    title: "Task 3",
    body: "Task 3 body",
    user_id: users[1].id,
  },
];

module.exports = { users, tasks };
