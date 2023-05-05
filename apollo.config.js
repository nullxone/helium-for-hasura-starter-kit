module.exports = {
  client: {
    service: {
      name: "my-graphql-app",
      url: "http://localhost:8080/v1/graphql",
      headers: {
        "x-hasura-admin-secret": "aFyrZOSGqAj2Eob5lNWz",
      },
    },
  },
};
