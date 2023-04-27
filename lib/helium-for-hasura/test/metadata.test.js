const Metadata = require("../metadata");
const path = require("path");
const fs = require("fs-extra");

test("compile metadata", () => {
  const appDir = path.join(__dirname, "./AppSimple");
  fs.emptyDirSync(path.join(appDir, "metadata"));

  Metadata.compile(path.join(appDir, "helium"), path.join(appDir, "metadata"));

  const outFile = path.join(appDir, "metadata/databases/databases.yml");

  [
    "metadata/databases/databases.yaml",
    "metadata/databases/default/tables/tables.yaml",
    "metadata/databases/default/tables/public_users.yaml",
  ].forEach((file) =>
    expect(fs.existsSync(path.join(appDir, file))).toBe(true)
  );
});
