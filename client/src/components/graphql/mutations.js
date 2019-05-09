import gql from "graphql-tag";

export const ADD_TARGET = gql`
  mutation CreateTarget($name: String!, $targetIp: String!) {
    createTarget(name: $name, targetIp: $targetIp) {
      success
      message
      targets {
        userId
        id
        name
        targetIp
      }
    }
  }
`;

export const DELETE_TARGET = gql`
  mutation DeleteTarget($targetId: ID!) {
    deleteTarget(targetId: $targetId) {
      success
      message
      targets {
        userId
        id
        name
        targetIp
      }
    }
  }
`;

export const UPDATE_TARGET = gql`
  mutation UpdateTarget($targetId: ID!, $name: String!, $targetIp: String!) {
    updateTarget(targetId: $targetId, name: $name, targetIp: $targetIp) {
      success
      message
      targets {
        userId
        id
        name
        targetIp
      }
    }
  }
`;
