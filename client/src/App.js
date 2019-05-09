import React, { useContext, useReducer } from "react";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { Query, ApolloProvider } from "react-apollo";
import gql from "graphql-tag";

import Pages from "./pages";
import Login from "./pages/login";

import Context from "./context";
import reducer from "./reducer";
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
  // useContext hookの戻り値による初期状態の定義
  const initialState = useContext(Context);
  // useReducer hookの戻り値を配列に格納
  const [state, dispatch] = useReducer(reducer, initialState);
  // console.log({ state });

  return (
    <ApolloProvider client={client}>
      {/* Contextのインスタンスによるプロバイダ定義 */}
      <Context.Provider value={{ state, dispatch }}>
        <Query query={IS_LOGGED_IN}>
          {({ data }) => (data.isLoggedIn ? <Pages /> : <Login />)}
        </Query>
      </Context.Provider>
    </ApolloProvider>
  );
};

export default App;
