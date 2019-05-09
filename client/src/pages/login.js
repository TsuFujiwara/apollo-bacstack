import React from "react";
import { Mutation, ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";

import { LoginForm, Loading } from "../components";

export const LOGIN_USER = gql`
  mutation login($email: String!) {
    login(email: $email)
  }
`;

export const GET_TARGETSANDOBJECTS = gql`
  query User {
    me {
      id
      email
      userIp
      broadcastIp
      pollingState
      pollingTime
      targets {
        userId
        id
        name
        targetIp
        objects {
          objectId
          objectName
          objectType
          instanceNumber
          presentValue
          statusFlags
        }
      }
    }
  }
`;

export default function Login() {
  return (
    <ApolloConsumer>
      {client => (
        <Mutation
          mutation={LOGIN_USER}
          onCompleted={({ login }) => {
            localStorage.setItem("token", login);
            client.writeData({ data: { isLoggedIn: true } });
          }}
        >
          {(login, { loading, error }) => {
            // this loading state will probably never show,
            // but it's helpful to have for testing
            if (loading) return <Loading />;
            if (error) return <p>An error occurred</p>;

            return <LoginForm login={login} />;
          }}
        </Mutation>
      )}
    </ApolloConsumer>
  );
}
