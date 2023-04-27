const Database = require("../database");
const path = require("path");
const fs = require("fs-extra");

test("database config to database metadata", () => {
  const appDir = path.join(__dirname, "./AppSimple");
  fs.emptyDirSync(path.join(appDir, "metadata"));

  Database.compile(
    require(path.join(appDir, "helium/Database")),
    path.join(appDir, "metadata")
  );

  const outFile = path.join(appDir, "metadata/databases/databases.yaml");

  expect(fs.existsSync(outFile)).toBe(true);
  expect(fs.readFileSync(outFile, "utf8")).toMatchSnapshot();
});
