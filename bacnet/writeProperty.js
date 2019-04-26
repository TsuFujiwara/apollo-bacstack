// WritePropertyMultiple
// const writeArray = [
//   {
//     objectId: { type: 1, instance: 0 },
//     values: [
//       {
//         property: { id: 85 },
//         value: [
//           {
//             type: bacnet.enum.ApplicationTags.BACNET_APPLICATION_TAG_REAL,
//             value: 20
//           }
//         ],
//         priority: 8
//       }
//     ]
//   },
//   {
//     objectId: { type: 1, instance: 0 },
//     values: [
//       {
//         property: { id: 85 },
//         value: [
//           {
//             type: bacnet.enum.ApplicationTags.BACNET_APPLICATION_TAG_REAL,
//             value: 20
//           }
//         ],
//         priority: 8
//       }
//     ]
//   }
// ];

// client.writePropertyMultiple(targetAddress, writeArray, (err, value) => {
//   console.log("value", value);
// });

// client.writeProperty(
//   targetAddress,
//   { type: 1, instance: 0 },
//   85,
//   [
//     {
//       type: bacnet.enum.ApplicationTags.BACNET_APPLICATION_TAG_REAL,
//       value: 100
//     }
//   ],
//   { priority: 8 },
//   function(err, value) {
//     console.log("value: ", value);
//   }
// );

// ReadPropertyMultiple
