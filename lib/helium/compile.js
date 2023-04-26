const path = require("path");
require("./metadata").compile(
  path.join(process.cwd(), process.argv[2]),
  path.join(process.cwd(), process.argv[3])
);
