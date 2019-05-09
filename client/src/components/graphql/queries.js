import gql from "graphql-tag";

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
