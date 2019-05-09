const { DataSource } = require("apollo-datasource");
const isEmail = require("isemail");

const bacstack = require("../bacnet/readProperty");

class UserAPI extends DataSource {
  constructor({ store }) {
    super();
    // utils.jsで作成したcreateStoreのメソッドをベースメントとする。
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context;
  }

  /**
   * User can be called with an argument that includes email, but it doesn't
   * have to be. If the user is already on the context, it will use that user
   * instead
   */

  async findOrCreateUser({ email: emailArg } = {}) {
    const email =
      this.context && this.context.user ? this.context.user.email : emailArg;
    if (!email || !isEmail.validate(email)) return null;

    const users = await this.store.users.findOrCreate({
      where: { email }
    });
    return users && users[0] ? users[0] : null;
  }

  async updateUser({ userIp, broadcastIp, pollingState, pollingTime } = {}) {
    const userId = this.context.user.id;
    const users = await this.store.users.update(
      // 更新内容
      {
        userIp: userIp,
        broadcastIp: broadcastIp,
        pollingState: pollingState,
        pollingTime: pollingTime
      },
      // 対象
      { where: { id: userId } }
    );
    return users && users[0] ? users[0] : null;
  }

  async createTarget({ name, targetIp }) {
    const userId = this.context.user.id;
    const res = await this.store.targets.findOrCreate({
      where: { userId, name, targetIp }
    });
    return res && res.length ? res[0].get() : false;
  }

  async deleteTarget({ targetId }) {
    const userId = this.context.user.id;
    const result =
      !!this.store.targets.destroy({
        where: { userId: userId, id: targetId }
      }) &&
      !!this.store.objects.destroy({
        where: { userId: userId, targetId: targetId }
      }) &&
      !!this.store.timeseries.destroy({
        where: { userId: userId, targetId: targetId }
      });
    return result;
  }

  async updateTarget({ targetId, name, targetIp }) {
    const userId = this.context.user.id;
    const result = !!this.store.targets.update(
      // 更新内容
      {
        name: name,
        targetIp: targetIp
      },
      // 対象
      { where: { userId: userId, id: targetId } }
    );
    return result;
  }

  async createObjects({ objectsData }) {
    const userId = this.context.user.id;
    if (!userId) return;

    let results = [];
    // for each launch id, try to book the trip and add it to the results array
    // if successful
    for (const objectData of objectsData) {
      const res = await this.createObject(objectData);
      if (res) results.push(res);
    }

    return results.every(function(val, index, array) {
      return val;
    });
  }

  async createObject({
    targetId,
    objectName,
    objectType,
    instanceNumber,
    objectId = null,
    units = null,
    maxPresValue = null,
    minPresValue = null,
    notifyType = null,
    highLimit = null,
    lowLimit = null,
    inactiveText = null,
    activeText = null,
    polarity = null,
    fileType = null,
    fileSize = null,
    numberOfStates = null,
    stateText1 = null,
    stateText2 = null,
    stateText3 = null,
    stateText4 = null,
    stateText5 = null,
    stateText6 = null,
    stateText7 = null,
    stateText8 = null,
    stateText9 = null,
    stateText10 = null,
    notificationClass = null,
    logDeviceObjectProperty1 = null,
    logDeviceObjectProperty2 = null,
    logDeviceObjectProperty3 = null,
    logDeviceObjectProperty4 = null,
    logInterval = null,
    bufferSize = null,
    maxPresValue2 = null,
    scale = null,
    objectIdentifier1 = null,
    objectIdentifier2 = null,
    memo = null,
    covMode = null,
    covInterval = null,
    eventEnable = null,
    limitEnable = null,
    covIncrement = null,
    timeDelay = null,
    feedbackToPV = null,
    intrinsicEventDisable = null,
    profileName = null,
    presentValue = null,
    statusFlags = null
  }) {
    const userId = this.context.user.id;
    objectId = objectType * 2 ** 22 + instanceNumber;
    const res = await this.store.objects.findOrCreate({
      where: {
        userId,
        targetId,
        objectName,
        objectType,
        instanceNumber,
        objectId,
        units,
        maxPresValue,
        minPresValue,
        notifyType,
        highLimit,
        lowLimit,
        inactiveText,
        activeText,
        polarity,
        fileType,
        fileSize,
        numberOfStates,
        stateText1,
        stateText2,
        stateText3,
        stateText4,
        stateText5,
        stateText6,
        stateText7,
        stateText8,
        stateText9,
        stateText10,
        notificationClass,
        logDeviceObjectProperty1,
        logDeviceObjectProperty2,
        logDeviceObjectProperty3,
        logDeviceObjectProperty4,
        logInterval,
        bufferSize,
        maxPresValue2,
        scale,
        objectIdentifier1,
        objectIdentifier2,
        memo,
        covMode,
        covInterval,
        eventEnable,
        limitEnable,
        covIncrement,
        timeDelay,
        feedbackToPV,
        intrinsicEventDisable,
        profileName,
        presentValue,
        statusFlags
      }
    });
    return res && res.length ? !!res[0].get() : false;
  }

  async deleteObjects({ targetId, obIds }) {
    const userId = this.context.user.id;
    const result = obIds.map(obId => {
      return (
        !!this.store.objects.destroy({
          where: { userId: userId, targetId: targetId, id: obId }
        }) &&
        !!this.store.timeseries.destroy({
          where: { userId: userId, targetId: targetId, obId: obId }
        })
      );
    });
    return result.every(val => {
      return val;
    });
  }

  async updateObject({ objectData }) {
    const userId = this.context.user.id;
    if (!userId) return;
    objectData.objectId =
      objectData.objectType * 2 ** 22 + objectData.instanceNumber;
    const result = !!this.store.objects.update(
      // 更新内容
      {
        objectId: objectData.objectId,
        objectName: objectData.objectName,
        objectType: objectData.objectType,
        instanceNumber: objectData.instanceNumber,
        units: objectData.units,
        maxPresValue: objectData.maxPresValue,
        minPresValue: objectData.minPresValue,
        notifyType: objectData.notifyType,
        highLimit: objectData.highLimit,
        lowLimit: objectData.lowLimit,
        inactiveText: objectData.inactiveText,
        activeText: objectData.activeText,
        polarity: objectData.polarity,
        fileType: objectData.fileType,
        fileSize: objectData.fileSize,
        numberOfStates: objectData.numberOfStates,
        stateText1: objectData.stateText1,
        stateText2: objectData.stateText2,
        stateText3: objectData.stateText3,
        stateText4: objectData.stateText4,
        stateText5: objectData.stateText5,
        stateText6: objectData.stateText6,
        stateText7: objectData.stateText7,
        stateText8: objectData.stateText8,
        stateText9: objectData.stateText9,
        stateText10: objectData.stateText10,
        notificationClass: objectData.notificationClass,
        logDeviceObjectProperty1: objectData.logDeviceObjectProperty1,
        logDeviceObjectProperty2: objectData.logDeviceObjectProperty2,
        logDeviceObjectProperty3: objectData.logDeviceObjectProperty3,
        logDeviceObjectProperty4: objectData.logDeviceObjectProperty4,
        logInterval: objectData.logInterval,
        bufferSize: objectData.bufferSize,
        maxPresValue2: objectData.maxPresValue2,
        scale: objectData.scale,
        objectIdentifier1: objectData.objectIdentifier1,
        objectIdentifier2: objectData.objectIdentifier2,
        memo: objectData.memo,
        covMode: objectData.covMode,
        covInterval: objectData.covInterval,
        eventEnable: objectData.eventEnable,
        limitEnable: objectData.limitEnable,
        covIncrement: objectData.covIncrement,
        timeDelay: objectData.timeDelay,
        feedbackToPV: objectData.feedbackToPV,
        intrinsicEventDisable: objectData.intrinsicEventDisable,
        profileName: objectData.profileName,
        presentValue: objectData.presentValue,
        statusFlags: objectData.statusFlags
      },
      // 対象
      {
        where: {
          userId: userId,
          targetId: objectData.targetId,
          id: objectData.id
        }
      }
    );
    return result;
  }

  async addPV() {
    const userId = this.context.user.id;
    const userIp = this.context.user.userIp;
    const broadcastIp = this.context.user.broadcastIp;
    function reverseString(str) {
      return str
        .split("")
        .reverse()
        .join("");
    }

    // ユーザが持つTargetをすべて検索
    const foundTargets = await this.store.targets.findAll({
      where: { userId }
    });

    // readObject
    let readObject = {};
    await Promise.all(
      foundTargets.map(async target => {
        var foundObjects = await this.store.objects.findAll({
          where: {
            userId: userId,
            targetId: target.dataValues["id"]
          }
        });
        readObject[`${target.dataValues["targetIp"]}`] = await foundObjects.map(
          object => {
            return {
              userId: object["dataValues"]["userId"],
              targetId: object["dataValues"]["targetId"],
              obId: object["dataValues"]["id"],
              objectId: {
                type: object["dataValues"]["objectType"],
                instance: object["dataValues"]["instanceNumber"]
              },
              properties: [
                {
                  id: 8
                }
              ]
            };
          }
        );

        if (
          !readObject[`${target.dataValues["targetIp"]}`] ||
          readObject[`${target.dataValues["targetIp"]}`].length === 0
        ) {
          return;
        }

        // console.log(
        //   readObject[`${target.dataValues["targetIp"]}`][2]["objectId"]
        // );

        // BACnetデバイスへreadPropetyMultipleを行う
        let objects = await bacstack(
          userIp,
          broadcastIp,
          target.dataValues["targetIp"],
          readObject[`${target.dataValues["targetIp"]}`]
        );

        if (!objects) return;

        objects.map((objectData, i) => {
          let targetId =
            readObject[`${target.dataValues["targetIp"]}`][i]["targetId"];
          let obId = readObject[`${target.dataValues["targetIp"]}`][i]["obId"];
          let presentValue = objectData.presentValue;
          let statusFlags = parseInt(
            reverseString(objectData.statusFlags)
              .replace(/T/g, "1")
              .replace(/F/g, "0"),
            2
          );

          // DBへpresentValue, statusFlagsの書込み
          const result_t = !!this.store.timeseries.create(
            // 更新内容
            {
              userId: userId,
              targetId: targetId,
              obId: obId,
              presentValue: presentValue,
              statusFlags: statusFlags
            }
          );

          // ObjectsテーブルのpresentValue, statusFlagsのアップデート
          const result_p = !!this.store.objects.update(
            // 更新内容
            {
              presentValue: presentValue,
              statusFlags: statusFlags
            },
            // 対象
            {
              where: {
                userId: userId,
                targetId: targetId,
                id: obId
              }
            }
          );
          return result_t & result_p;
        });

        return readObject;
      })
    );

    // console.log(readObject);
    const addSuccess = !!foundTargets;

    return addSuccess;
  }

  async getTargetsByUser() {
    const userId = this.context.user.id;
    const found = await this.store.targets.findAll({
      where: { userId }
    });
    console.log(found);
    return found;
  }

  async getObjectsByTarget({ targetId }) {
    const userId = this.context.user.id;
    const found = await this.store.objects.findAll({
      where: { userId, targetId }
    });
    return found;
  }

  async getTimeSeriesByObject({ obId }) {
    const userId = this.context.user.id;
    const found = await this.store.timeseries.findAll({
      where: { userId, obId }
    });
    console.log(found[0]["dataValues"]);
    return found;
  }

  /**
   * getTargetsByUser();
   * getObjectsByTarget({ targetId });
   * getTimeSeriesByObject({ targetId, objectId });
   * createTarget({ targetId, name, targetIp });
   * deleteTarget({ targetId });
   * createObjects({ objectId, ojectName, objectType, instanceNumber });
   * deleteObject({ objectId });
   * login({ email });
   *
   */
}

module.exports = UserAPI;
