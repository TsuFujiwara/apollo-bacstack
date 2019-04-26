const bacnet = require("@biancoroyal/bacstack");
const propertiesList = require("./propertiesList");
const requestArray_all = require("./objectsList");
// const Encoding = require("encoding-japanese");

module.exports = (userIp, broadcastIp, targetIp, requestArray_all) =>
  new Promise(resolve => {
    let pollingTime = 1;

    let objects = [];

    function reverseString(str) {
      return str
        .split("")
        .reverse()
        .join("");
    }

    const client = new bacnet({
      port: 47808, // Use BAC0 as communication port
      interface: userIp, // Listen on a specific interface
      broadcastAddress: broadcastIp, // Use the subnet broadcast address
      adpuTimeout: 6000 // Wait twice as long for response
    });

    client.whoIs();

    // Discover Devices
    client.on("iAm", device => {
      console.log("targetIp: ", device.address);
      console.log("deviceId: ", device.deviceId);
      console.log("maxApdu: ", device.maxApdu);
      console.log("segmentation: ", device.segmentation);
      console.log("vendorId: ", device.vendorId);
    });

    // ReadPropertyMultiple
    // 起動時1発
    var dt = new Date();
    dt.setMonth(dt.getMonth() + 1);
    client.timeSync(targetIp, dt);

    client.readPropertyMultiple(targetIp, requestArray_all, (err, value) => {
      try {
        console.log(requestArray_all);
        for (var i in value.values) {
          // i はオブジェクト個数
          let properties = {};
          for (var j in value.values[i].values) {
            // j はプロパティ個数
            let propertyName = propertiesList[value.values[i].values[j].id];
            // if (propertyName === "objectType")
            //   console.log(value.values[i].values[j].id);
            let comVal = value.values[i].values[j].value[0].value;

            if (propertyName) {
              switch (propertyName) {
                case "eventEnable":
                  properties[propertyName] = reverseString(
                    ("000" + Number(comVal.value).toString(2)).slice(-3)
                  )
                    .replace(/1/g, "T")
                    .replace(/0/g, "F");
                  break;
                case "statusFlags":
                  properties[propertyName] = reverseString(
                    ("0000" + Number(comVal.value).toString(2)).slice(-4)
                  )
                    .replace(/1/g, "T")
                    .replace(/0/g, "F");
                  break;
                case "limitEnable":
                  properties[propertyName] = reverseString(
                    ("00" + Number(comVal.value).toString(2)).slice(-2)
                  )
                    .replace(/1/g, "T")
                    .replace(/0/g, "F");
                  break;
                case "objectId":
                  properties[propertyName] =
                    comVal.type * 2 ** 22 + comVal.instance;
                  properties["instanceNumber"] = comVal.instance;
                  break;
                default:
                  properties[propertyName] = comVal;
              }
            }
          }
          console.log(properties);
          objects.push(properties);
        }
        client.close();
        resolve(objects);
      } catch (error) {
        console.error(error);
        console.log(
          "Smart-Saveに接続できませんでした。" +
            "クライアントIPアドレス：" +
            userIp +
            " サーバのIPアドレス:" +
            targetIp +
            " にしてください。"
        );
        client.close();
      }
    });
  });

// // 起動処理終了後;
// var requestArray = [
//   {
//     objectId: { type: 3, instance: 0 },
//     properties: [{ id: 77 }, { id: 85 }, { id: 111 }]
//   },
//   {
//     objectId: { type: 4, instance: 0 },
//     properties: [{ id: 77 }, { id: 85 }, { id: 111 }]
//   },
//   {
//     objectId: { type: 5, instance: 0 },
//     properties: [{ id: 77 }, { id: 85 }, { id: 111 }]
//   }
// ];

// var tmp = new Object();
// var sf = new Object();
// var sf_str = "";

// setInterval(() => {
//   client.readPropertyMultiple(targetIp, requestArray, (err, value) => {
//     for (var i in value.values) {
//       tmp = value.values[i];
//       sf = tmp.values[2].value[0].value.value[0];
//       sf === 2 || sf === 3
//         ? (sf_str = String(sf) + "  unreliable !!")
//         : (sf_str = String(sf));
//       console.log(
//         `${tmp.values[0].value[0].value.substr(2)}  PV:${
//           tmp.values[1].value[0].value
//         }  SF:${sf_str}`
//       );
//     }
//     if (err) {
//       clearInterval();
//       console.log("clearInterval");
//     }
//   });
// }, pollingTime * 1000);
