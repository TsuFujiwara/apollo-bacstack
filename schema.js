const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    me: User
  }

  type Mutation {
    # Mutation: type of return
    createTarget(name: String!, targetIp: String!): TargetUpdateResponse!
    deleteTarget(targetId: ID!): TargetUpdateResponse!
    updateTarget(
      targetId: ID!
      name: String
      targetIp: String
    ): TargetUpdateResponse
    createObjects(objectsData: [ObjectInput]): ObjectUpdateResponse
    deleteObjects(targetId: ID!, obIds: [ID!]): ObjectUpdateResponse
    updateObject(objectData: ObjectInput): ObjectUpdateResponse
    # 以下ユーザ単位
    doRead: Boolean
    doReadLoop(startStop: Boolean): Boolean
    # deleteTimeSeries(startDate: String!, endDate: String!): Boolean!
    login(email: String!): String
    updateUser(userIp: String, broadcastIp: String): String
  }

  type TargetUpdateResponse {
    success: Boolean!
    message: String
    targets: [Target]
  }

  type ObjectUpdateResponse {
    success: Boolean!
    message: String
    objects: [Object]
  }

  type User {
    id: ID!
    email: String!
    userIp: String!
    broadcastIp: String!
    pollingState: Boolean
    pollingTime: Int
    targets: [Target]
  }

  type Target {
    userId: ID!
    id: ID!
    name: String!
    targetIp: String!
    objects: [Object]
  }

  type Object {
    userId: ID!
    targetId: ID!
    id: ID!
    objectId: Int
    objectName: String!
    objectType: Int!
    instanceNumber: Int!
    units: Int
    maxPresValue: Float
    minPresValue: Float
    notifyType: Int
    highLimit: Float
    lowLimit: Float
    inactiveText: String
    activeText: String
    polarity: Int
    fileType: Int
    fileSize: Int
    numberOfStates: Int
    stateText1: String
    stateText2: String
    stateText3: String
    stateText4: String
    stateText5: String
    stateText6: String
    stateText7: String
    stateText8: String
    stateText9: String
    stateText10: String
    notificationClass: Int
    logDeviceObjectProperty1: Int
    logDeviceObjectProperty2: Int
    logDeviceObjectProperty3: Int
    logDeviceObjectProperty4: Int
    logInterval: Int
    bufferSize: Int
    maxPresValue2: Float
    scale: Float
    objectIdentifier1: Int
    objectIdentifier2: Int
    memo: String
    covMode: Int
    covInterval: Int
    eventEnable: Int
    limitEnable: Boolean
    covIncrement: Int
    timeDelay: Int
    feedbackToPV: Boolean
    intrinsicEventDisable: Boolean
    profileName: String
    presentValue: Float
    statusFlags: Int
    timeSeries: [TimeSeries]
  }

  input ObjectInput {
    userId: ID
    targetId: ID!
    id: ID
    objectId: Int
    objectName: String!
    objectType: Int!
    instanceNumber: Int!
    units: Int
    maxPresValue: Float
    minPresValue: Float
    notifyType: Int
    highLimit: Float
    lowLimit: Float
    inactiveText: String
    activeText: String
    polarity: Int
    fileType: Int
    fileSize: Int
    numberOfStates: Int
    stateText1: String
    stateText2: String
    stateText3: String
    stateText4: String
    stateText5: String
    stateText6: String
    stateText7: String
    stateText8: String
    stateText9: String
    stateText10: String
    notificationClass: Int
    logDeviceObjectProperty1: Int
    logDeviceObjectProperty2: Int
    logDeviceObjectProperty3: Int
    logDeviceObjectProperty4: Int
    logInterval: Int
    bufferSize: Int
    maxPresValue2: Float
    scale: Float
    objectIdentifier1: Int
    objectIdentifier2: Int
    memo: String
    covMode: Int
    covInterval: Int
    eventEnable: Int
    limitEnable: Boolean
    covIncrement: Int
    timeDelay: Int
    feedbackToPV: Boolean
    intrinsicEventDisable: Boolean
    profileName: String
    presentValue: Float
    statusFlags: Int
  }

  type TimeSeries {
    userId: ID!
    targetId: ID
    obId: ID
    id: ID!
    createdAt: String
    presentValue: Float
    statusFlags: Int
  }
`;

module.exports = typeDefs;
