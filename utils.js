const SQL = require("sequelize");

module.exports.paginateResults = ({
  after: cursor,
  pageSize = 20,
  results,
  // can pass in a function to calculate an item's cursor
  getCursor = () => null
}) => {
  if (pageSize < 1) return [];

  if (!cursor) return results.slice(0, pageSize);
  const cursorIndex = results.findIndex(item => {
    // if an item has a `cursor` on it, use that, otherwise try to generate one
    let itemCursor = item.cursor ? item.cursor : getCursor(item);

    // if there's still not a cursor, return false by default
    return itemCursor ? cursor === itemCursor : false;
  });

  return cursorIndex >= 0
    ? cursorIndex === results.length - 1 // don't let us overflow
      ? []
      : results.slice(
          cursorIndex + 1,
          Math.min(results.length, cursorIndex + 1 + pageSize)
        )
    : results.slice(0, pageSize);

  results.slice(cursorIndex >= 0 ? cursorIndex + 1 : 0, cursorIndex >= 0);
};

module.exports.createStore = () => {
  // const Op = SQL.Op;
  // const operatorsAliases = {
  //   $in: Op.in
  // };

  const db = new SQL("database", "username", "password", {
    dialect: "sqlite",
    storage: "./store.sqlite",
    logging: false,
    retry: {
      match: [/SQLITE_BUSY/],
      max: 3
    }
  });

  const users = db.define("user", {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    email: SQL.STRING,
    token: SQL.STRING,
    userIp: SQL.STRING,
    broadcastIp: SQL.STRING,
    pollingState: SQL.BOOLEAN,
    pollingTime: SQL.INTEGER
  });

  const targets = db.define("target", {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    userId: SQL.INTEGER,
    name: SQL.STRING,
    targetIp: SQL.STRING
  });

  const objects = db.define("object", {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    userId: SQL.INTEGER,
    targetId: SQL.INTEGER,
    objectId: SQL.INTEGER,
    objectName: SQL.STRING,
    objectType: SQL.INTEGER,
    instanceNumber: SQL.INTEGER,
    units: SQL.INTEGER,
    maxPresValue: SQL.FLOAT,
    minPresValue: SQL.FLOAT,
    notifyType: SQL.INTEGER,
    highLimit: SQL.FLOAT,
    lowLimit: SQL.FLOAT,
    inactiveText: SQL.STRING,
    activeText: SQL.STRING,
    polarity: SQL.INTEGER,
    fileType: SQL.INTEGER,
    fileSize: SQL.INTEGER,
    numberOfStates: SQL.INTEGER,
    stateText1: SQL.STRING,
    stateText2: SQL.STRING,
    stateText3: SQL.STRING,
    stateText4: SQL.STRING,
    stateText5: SQL.STRING,
    stateText6: SQL.STRING,
    stateText7: SQL.STRING,
    stateText8: SQL.STRING,
    stateText9: SQL.STRING,
    stateText10: SQL.STRING,
    notificationClass: SQL.INTEGER,
    logDeviceObjectProperty1: SQL.INTEGER,
    logDeviceObjectProperty2: SQL.INTEGER,
    logDeviceObjectProperty3: SQL.INTEGER,
    logDeviceObjectProperty4: SQL.INTEGER,
    logInterval: SQL.INTEGER,
    bufferSize: SQL.INTEGER,
    maxPresValue2: SQL.FLOAT,
    scale: SQL.FLOAT,
    objectIdentifier1: SQL.INTEGER,
    objectIdentifier2: SQL.INTEGER,
    memo: SQL.STRING,
    covMode: SQL.INTEGER,
    covInterval: SQL.INTEGER,
    eventEnable: SQL.INTEGER,
    limitEnable: SQL.BOOLEAN,
    covIncrement: SQL.INTEGER,
    timeDelay: SQL.INTEGER,
    feedbackToPV: SQL.BOOLEAN,
    intrinsicEventDisable: SQL.BOOLEAN,
    profileName: SQL.STRING,
    presentValue: SQL.FLOAT,
    statusFlags: SQL.INTEGER
  });

  const timeseries = db.define("timeseries", {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    userId: SQL.INTEGER,
    targetId: SQL.INTEGER,
    obId: SQL.INTEGER,
    presentValue: SQL.FLOAT,
    statusFlags: SQL.INTEGER
  });

  return { users, targets, objects, timeseries };
};
