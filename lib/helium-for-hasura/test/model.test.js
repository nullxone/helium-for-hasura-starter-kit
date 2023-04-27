const { Model, exists, and, or, not, eq, ne } = require("../model");
const path = require("path");
const fs = require("fs-extra");

test("class to tracked table, has one relationship", () => {
  const appDir = path.join(__dirname, "./AppSimple");
  fs.emptyDirSync(path.join(appDir, "metadata"));

  Model.compile(
    require(path.join(appDir, "helium/models/Users")),
    path.join(appDir, "metadata")
  );

  const outFile = path.join(
    appDir,
    "metadata/databases/default/tables/public_users.yaml"
  );

  expect(fs.existsSync(outFile)).toBe(true);
  expect(fs.readFileSync(outFile, "utf8")).toMatchSnapshot();
});

test("belongs to relationship, has many relationship", () => {
  const appDir = path.join(__dirname, "./AppSimple");
  fs.emptyDirSync(path.join(appDir, "metadata"));

  Model.compile(
    require(path.join(appDir, "helium/models/Projects")),
    path.join(appDir, "metadata")
  );

  const outFile = path.join(
    appDir,
    "metadata/databases/default/tables/public_projects.yaml"
  );

  expect(fs.existsSync(outFile)).toBe(true);
  expect(fs.readFileSync(outFile, "utf8")).toMatchSnapshot();
});

test("write all tables file", () => {
  const appDir = path.join(__dirname, "./AppSimple");
  const metadataDir = path.join(appDir, "metadata");
  fs.emptyDirSync(metadataDir);

  Model.compile(require(path.join(appDir, "helium/models/Users")), metadataDir);

  Model.compile(require(path.join(appDir, "helium/models/Tasks")), metadataDir);

  Model.writeAllTables(metadataDir);

  const outFile = path.join(
    metadataDir,
    "databases/default/tables/tables.yaml"
  );

  expect(fs.existsSync(outFile)).toBe(true);
  expect(fs.readFileSync(outFile, "utf8")).toMatchSnapshot();
});

test("eq operator", () => {
  expect(eq("email", "foo")).toStrictEqual({ email: { _eq: "foo" } });
  expect(eq("user.profile.name", "foo")).toStrictEqual({
    user: { profile: { name: { _eq: "foo" } } },
  });
});

test("complex predicate", () => {
  expect(
    and(
      eq("user.id", "X-Hasura-User-Id"),
      or(
        and(not(eq("is_reviewed", true)), eq("category", "editorial")),
        ne("category", "editorial")
      ),
      exists("blog", eq("authors.id", "X-Hasura-User-Id"))
    )
  ).toMatchSnapshot();
});
