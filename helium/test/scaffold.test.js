const util = require("util");

const Scaffold = require("../../../helium-for-hasura/scaffold");

function printObject(obj) {
  console.log(util.inspect(obj, { depth: null, colors: true }));
}

test("database introspection", async () => {
  printObject(await Scaffold.scaffold(__dirname + "/.."));
});
