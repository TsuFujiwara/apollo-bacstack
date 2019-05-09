/*
Resolvers provide the instructions for turninig a GraphQL operation
(a query, mutation, or subscription) into data.
They either return the same type of data we specify in our schema or poromise for that data.
*/

/*
Resolver functions accept four arguments:
 fieldName: (parent, args, context, info) => data
  parent: An object that contains the result returned from the resolver on the parent type.
  args: An object that contains the arguments passed to the field
  context: An object shared by all resolvers in az GraphQL operation.
           We use the context to contain per-request state such as authentication infomation
           and access our datasources.
  info: Infomation about the execution state of the operation which should only be userd in advanced cases.
*/

module.exports = {
  Query: {
    me: async (_, __, { dataSources }) =>
      dataSources.userAPI.findOrCreateUser(),
    targets: async (_, __, { dataSources }) => {
      // get targets by user
      const targets = await dataSources.userAPI.getTargetsByUser();
      // return targets
      return targets;
    },
    objects: async (_, { targetIds }, { dataSources }) => {
      const doubleArr = await Promise.all(
        targetIds.map(async targetId => {
          return await dataSources.userAPI.getObjectsByTarget({
            targetId: targetId
          });
        })
      );
      const list = await doubleArr.reduce((pre, current) => {
        pre.push(...current);
        return pre;
      }, []);
      // console.log(list);
      return list;
    },
    timeSeries: async (_, { obIds }, { dataSources }) => {
      const doubleArr = await Promise.all(
        obIds.map(obId => {
          return dataSources.userAPI.getTimeSeriesByObject({
            obId: obId
          });
        })
      );
      const list = await doubleArr.reduce((pre, current) => {
        pre.push(...current);
        return pre;
      }, []);
      // console.log(list);
      return list;
    }
  },

  User: {
    targets: async (_, __, { dataSources }) => {
      // get targets by user
      const targets = await dataSources.userAPI.getTargetsByUser();
      // return targets
      return targets;
    }
  },

  Target: {
    objects: async (target, __, { dataSources }) => {
      const objects = await dataSources.userAPI.getObjectsByTarget({
        targetId: target.id
      });
      return objects;
    }
  },

  Object: {
    timeSeries: async (object, __, { dataSources }) => {
      const timeSeries = await dataSources.userAPI.getTimeSeriesByObject({
        obId: object.id
      });
      return timeSeries;
    }
  },

  Mutation: {
    createTarget: async (_, { name, targetIp }, { dataSources }) => {
      const result = await dataSources.userAPI.createTarget({
        name,
        targetIp
      });
      const targets = await dataSources.userAPI.getTargetsByUser();
      if (!result)
        return {
          success: false,
          message: "failed to create target"
        };
      return {
        success: true,
        message: "create target",
        targets: targets
      };
    },
    deleteTarget: async (_, { targetId }, { dataSources }) => {
      const result = dataSources.userAPI.deleteTarget({ targetId });
      const targets = await dataSources.userAPI.getTargetsByUser();
      if (!result)
        return {
          success: false,
          message: "failed to delete target"
        };
      return {
        success: true,
        message: "target deleted",
        targets: targets
      };
    },
    updateTarget: async (_, { targetId, name, targetIp }, { dataSources }) => {
      const result = dataSources.userAPI.updateTarget({
        targetId,
        name,
        targetIp
      });
      const targets = await dataSources.userAPI.getTargetsByUser();
      if (!result)
        return {
          success: false,
          message: "failed to update target"
        };
      return {
        success: true,
        message: "target updated",
        targets: targets
      };
    },
    createObjects: async (_, { objectsData }, { dataSources }) => {
      const results = await dataSources.userAPI.createObjects({
        objectsData
      });
      const objects = await dataSources.userAPI.getObjectsByTarget({
        targetId: objectsData[0].targetId
      });
      if (!results || !objects)
        return {
          bsuccess: results,
          message: "failed to create objects"
        };
      return {
        success: results,
        message: "create objects successfully",
        objects: objects
      };
    },
    deleteObjects: async (_, { targetId, obIds }, { dataSources }) => {
      const result = dataSources.userAPI.deleteObjects({
        targetId,
        obIds
      });
      if (!result)
        return {
          success: false,
          message: "failed to delete object"
        };
      const objects = await dataSources.userAPI.getObjectsByTarget({
        targetId: targetId
      });
      return {
        success: true,
        message: "object deleted",
        objects: objects
      };
    },
    updateObject: async (_, { objectData }, { dataSources }) => {
      const result = await dataSources.userAPI.updateObject({
        objectData
      });
      const objects = await dataSources.userAPI.getObjectsByTarget({
        targetId: objectData.targetId
      });
      if (!result || !objects)
        return {
          bsuccess: result,
          message: "failed to update object"
        };
      return {
        success: result,
        message: "update object successfully",
        objects: objects
      };
    },
    doRead: async (_, {}, { dataSources }) => {
      const result = await dataSources.userAPI.addPV();
      return result;
    },
    doReadLoop: async (_, { startStop }, { dataSources }) => {
      const result = await dataSources.userAPI.updateUser({
        pollingState: startStop
      });
      const user = await dataSources.userAPI.findOrCreateUser();
      if (!user.dataValues["pollingState"]) {
        clearInterval(startTimer);
      }
      startTimer = setInterval(async () => {
        const startStopState = await dataSources.userAPI.findOrCreateUser();
        console.log(startStopState.dataValues["pollingState"]);
        if (!startStopState.dataValues["pollingState"]) {
          clearInterval(startTimer);
          return false;
        }
        const result = dataSources.userAPI.addPV();
      }, user.dataValues["pollingTime"] * 1000);
      // 戻り値未完成
      return result;
    },

    // OK
    login: async (_, { email }, { dataSources }) => {
      const user = await dataSources.userAPI.findOrCreateUser({
        email
      });
      if (user) return Buffer.from(email).toString("base64");
    },
    // OK
    updateUser: async (
      _,
      { userIp, broadcastIp, pollingState, pollintTime },
      { dataSources }
    ) => {
      const user = await dataSources.userAPI.updateUser({
        userIp,
        broadcastIp,
        pollingState,
        pollintTime
      });
      if (user) return user;
    }
  }
};
