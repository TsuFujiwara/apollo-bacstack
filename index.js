// const { ApolloServer } = require("apollo-server-express");

const { ApolloServer } = require("apollo-server");
const isEmail = require("isemail");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");
// we create our database by calling createStore
// we also pass in our database we created to the UserAPI data source.
const { createStore } = require("./utils");

// const express = require("express");
const bacstack = require("./bacnet/readProperty");

// UserAPI data source to connect our SQL database, we need to add them to our graph API
const UserAPI = require("./datasources/user");

// creates a sequelize connection once. NOT for every request
const store = createStore();

// set up any dataSources our resolvers need
const dataSources = () => ({
  userAPI: new UserAPI({ store })
});

// the function that sets up the global context for each resolver, using the req
const context = async ({ req }) => {
  // simple auth check on every request
  const auth = (req.headers && req.headers.authorization) || "";
  const email = Buffer.from(auth, "base64").toString("ascii");

  // if the email isn't formatted validly, return null for user
  if (!isEmail.validate(email)) return { user: null };
  // find a user by their email
  const users = await store.users.findOrCreate({ where: { email } });
  const user = users && users[0] ? users[0] : null;

  return { user: { ...user.dataValues } };
};

// モックデータ (オブジェクトのリスト)
// readProperty
// const objects = [
//   {
//     objectId: "",
//     objectType: "",
//     instanceNumber: "",
//     presentValue: "",
//     statusFlags: ""
//   },
//   {
//     objectId: "",
//     objectType: "",
//     instanceNumber: "",
//     presentValue: "",
//     statusFlags: ""
//   }
// ];

// bacstack().then(res => {
//   objects = res;
// });

// // playgroundの設定
// const PLAYGROUND = {
//   endpoint: `http://localhost:4000/graphql`,
//   settings: {
//     "editor.theme": "light"
//   }
// };

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // we hook up our data sources to Apollo Server
  // たとえはRestAPIからや
  dataSources,
  context
});

// Start our server if we're not in a test env.
// if we're in a test env, we'll manually start it in a test
if (process.env.NODE_ENV !== "test")
  server
    .listen({ port: 4000 })
    .then(({ url }) => console.log(`🚀 app running at ${url}`));

// export all the important pieces for integration/e2e tests to use
module.exports = {
  dataSources,
  context,
  typeDefs,
  resolvers,
  ApolloServer,
  UserAPI,
  store,
  server
};

/*
// Expressの初期化
const APP = express();

// GraphQLのエンドポイントの追加
SERVER.applyMiddleware({
  app: APP
});

// サーバの起動
APP.listen(4000, () => {
  console.log(`Go to ${PLAYGROUND.endpoint} to run!`);
});

module.exports = APP;
*/
