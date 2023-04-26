const yaml = require("js-yaml");

test("get class name from class", () => {
  expect(require("./AppSimple/models/Users").name).toBe("Users");
});

test("create yaml file from object", () => {
  const o = { table: { name: "users", schema: "public" } };
  const y = yaml.dump(o);
  console.log(y);
});
