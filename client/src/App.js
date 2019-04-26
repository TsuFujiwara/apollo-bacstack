import React from "react";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { Query, ApolloProvider } from "react-apollo";
import gql from "graphql-tag";

import Pages from "./pages";
import Login from "./pages/login";
import { resolvers, typeDefs } from "./resolvers";

const cache = new InMemoryCache();
const client = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: "http://localhost:4000/graphql",
    headers: {
      authorization: localStorage.getItem("token"),
      "client-name": "BACnet Client App [web]",
      "client-version": "1.0.0"
    }
  }),
  resolvers,
  typeDefs
});

// InMemoryCacheのCaching機能
cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem("token")
  }
});

//
const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    # @Clientの意味がよく分からない
    isLoggedIn @client
  }
`;

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Query query={IS_LOGGED_IN}>
        {({ data }) => (data.isLoggedIn ? <Pages /> : <Login />)}
      </Query>
    </ApolloProvider>
  );
};

export default App;
