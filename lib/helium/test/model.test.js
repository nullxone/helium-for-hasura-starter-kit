const Model = require("../model");
const path = require("path");
const fs = require("fs-extra");

test("class to tracked table", () => {
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
  expect(fs.readFileSync(outFile, "utf-8")).toMatchSnapshot();
});
