import React, { useState, Fragment } from "react";
// import { Query, Mutation } from "react-apollo";
// import { Link } from "@reach/router";

import { withStyles } from "@material-ui/core/styles";
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import TableHead from "@material-ui/core/TableHead";
// import TableRow from "@material-ui/core/TableRow";
// import Paper from "@material-ui/core/Paper";
// import FormControl from "@material-ui/core/FormControl";
// import Input from "@material-ui/core/Input";
// import InputLabel from "@material-ui/core/InputLabel";
// import Button from "@material-ui/core/Button";
// // import Select from "@material-ui/core/Select";
// // import MenuItem from "@material-ui/core/MenuItem";
// import DeleteIcon from "@material-ui/icons/Delete";
// import AddIcon from "@material-ui/icons/Add";

// // import Context from "../context";
// import { GET_TARGETSANDOBJECTS } from "../components/graphql/queries";
// import {
//   ADD_TARGET,
//   DELETE_TARGET,
//   UPDATE_TARGET
// } from "../components/graphql/mutations";

// import IconButton from "@material-ui/core/IconButton";
// import EditIcon from "@material-ui/icons/Edit";
// import Done from "@material-ui/icons/Done";
// import Cancel from "@material-ui/icons/Cancel";
// import TextField from "@material-ui/core/TextField";

// const CustomTableCell = withStyles(theme => ({
//   head: {
//     // backgroundColor: theme.palette.common.black,
//     backgroundColor: "#2196f3",
//     color: theme.palette.common.white
//   },
//   body: {
//     fontSize: 14
//   }
// }))(TableCell);

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 100
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  },
  margin: {
    margin: theme.spacing.unit
  },
  submit: {
    margin: theme.spacing.unit
  },
  icon: {
    margin: theme.spacing.unit / 2
    // fontSize: 32
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  button: {
    margin: theme.spacing.unit
  },
  form: {
    margin: 0,
    display: "inline"
  },
  bootstrapRoot: {
    boxShadow: "none",
    textTransform: "none",
    fontSize: 16,
    padding: "6px 12px",
    border: "1px solid",
    lineHeight: 1.5,
    backgroundColor: "#007bff",
    borderColor: "#007bff",
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(","),
    "&:hover": {
      backgroundColor: "#0069d9",
      borderColor: "#0062cc"
    },
    "&:active": {
      boxShadow: "none",
      backgroundColor: "#0062cc",
      borderColor: "#005cbf"
    },
    "&:focus": {
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)"
    }
  }
});

const Objects = ({ targetId, classes }) => {
  // let targetName;
  // let targetIp;
  // // const { state, dispatch } = useContext(Context);
  // const [state, setState] = useState({
  //   updateTargetId: 0,
  //   updateTargetName: "",
  //   updateTargetIp: "",
  //   lebelwidth: 0,
  //   editedIndex: -1
  // });

  // const { editedIndex } = state;

  // const editComponent = (id, name, targetIp, index) => {
  //   console.log("editComponent index", index);
  //   setState({
  //     ...state,
  //     updateTargetId: id,
  //     updateTargetName: name,
  //     updateTargetIp: targetIp,
  //     editedIndex: index
  //   });
  // };
  // const cancelEdit = () => {
  //   setState({ ...state, editedIndex: -1 });
  // };

  // const detailBtn = targetId => (
  //   <Button
  //     variant="contained"
  //     className={classes.bootstrapRoot}
  //     color="primary"
  //     disableRipple
  //     onClick={() => <Link to="objects" />}
  //   >
  //     Detail
  //   </Button>
  // );

  // const deleteIcon = index => {
  //   // console.log("index1_delete", index);
  //   return (
  //     <Mutation mutation={DELETE_TARGET}>
  //       {deleteTarget => (
  //         <form
  //           className={classes.form}
  //           onSubmit={e => {
  //             // console.log("index2_delete", index);
  //             deleteTarget({
  //               variables: {
  //                 targetId: index
  //               }
  //             });
  //             setState({ ...state, editedIndex: -1 });
  //             e.preventDefalut();
  //           }}
  //         >
  //           <IconButton type="submit">
  //             <DeleteIcon color="secondary" />
  //           </IconButton>
  //         </form>
  //       )}
  //     </Mutation>
  //   );
  // };

  // const editIcon = (id, name, targetIp, index) => {
  //   //
  //   return (
  //     <IconButton onClick={() => editComponent(id, name, targetIp, index)}>
  //       <EditIcon color="primary" />
  //     </IconButton>
  //   );
  // };

  // const okBtn = index => {
  //   // updateComponent(index);
  //   console.log("index1_update", index);
  //   return (
  //     <Mutation mutation={UPDATE_TARGET}>
  //       {updateTarget => (
  //         <IconButton
  //           onClick={() => {
  //             console.log("index2_update:", index);
  //             console.log("state.updateTargetId:", state.updateTargetId);
  //             console.log("state.updateTargetName:", state.updateTargetName);
  //             console.log("state.updateTargetIp:", state.updateTargetIp);
  //             updateTarget({
  //               variables: {
  //                 targetId: state.updateTargetId,
  //                 name: state.updateTargetName,
  //                 targetIp: state.updateTargetIp
  //               }
  //             });
  //             setState({ ...state, editedIndex: -1 });
  //           }}
  //         >
  //           <Done color="secondary" />
  //         </IconButton>
  //       )}
  //     </Mutation>
  //   );
  // };

  // const cancelBtn = (
  //   <IconButton onClick={cancelEdit}>
  //     <Cancel color="primary" />
  //   </IconButton>
  // );

  // const handleChange = name => event => {
  //   setState({
  //     ...state,
  //     [name]: event.target.value
  //   });
  // };

  // const editName = editedName => (
  //   <TextField
  //     id="name"
  //     label="Name"
  //     className={classes.textField}
  //     defaultValue={editedName}
  //     margin="normal"
  //     onChange={handleChange("updateTargetName")}
  //   />
  // );

  // const editIp = editedIp => (
  //   <TextField
  //     id="Ip"
  //     label="targetIp"
  //     className={classes.textField}
  //     defaultValue={editedIp}
  //     margin="normal"
  //     onChange={handleChange("updateTargetIp")}
  //   />
  // );

  return (
    <Fragment>
      <h1>targetId: {targetId}</h1>
      <div>オブジェクト一覧</div>
    </Fragment>
    // <Query query={GET_TARGETSANDOBJECTS} fetchPolicy="network-only">
    //   {/* GraphQLのクエリの実行結果の処理、成功したら結果を表示 */}
    //   {({ data, loading, error }) => {
    //     if (loading) return <p>Loading...</p>;
    //     if (error) return <p>Error</p>;
    //     // console.log(data.me);

    //     return (
    //       <Fragment>
    //         <Paper className={classes.root}>
    //           <Table className={classes.table}>
    //             <TableHead>
    //               <TableRow>
    //                 <CustomTableCell align="right">Objects</CustomTableCell>
    //                 <CustomTableCell align="right">Actions</CustomTableCell>
    //                 <CustomTableCell align="right">#</CustomTableCell>
    //                 <CustomTableCell align="right">Target Name</CustomTableCell>
    //                 <CustomTableCell align="right">Target IP</CustomTableCell>
    //               </TableRow>
    //             </TableHead>
    //             <TableBody>
    //               {data.me && data.me.targets.length
    //                 ? data.me.targets.map((n, id) => {
    //                     return (
    //                       <TableRow key={n.name}>
    //                         <CustomTableCell
    //                           component="th"
    //                           scope="row"
    //                           align="right"
    //                         >
    //                           {detailBtn(n.id)}
    //                         </CustomTableCell>
    //                         <CustomTableCell
    //                           className={classes.iconCell}
    //                           align="right"
    //                         >
    //                           {data.me.targets.indexOf(n) === editedIndex
    //                             ? okBtn(n.id)
    //                             : deleteIcon(n.id)}
    //                           {data.me.targets.indexOf(n) === editedIndex
    //                             ? cancelBtn
    //                             : editIcon(
    //                                 n.id,
    //                                 n.name,
    //                                 n.targetIp,
    //                                 data.me.targets.indexOf(n)
    //                               )}
    //                         </CustomTableCell>
    //                         <CustomTableCell align="right">
    //                           {id}
    //                         </CustomTableCell>
    //                         <CustomTableCell align="right">
    //                           {data.me.targets.indexOf(n) === editedIndex
    //                             ? editName(n.name)
    //                             : n.name}
    //                         </CustomTableCell>
    //                         <CustomTableCell align="right">
    //                           {data.me.targets.indexOf(n) === editedIndex
    //                             ? editIp(n.targetIp)
    //                             : n.targetIp}
    //                         </CustomTableCell>
    //                       </TableRow>
    //                     );
    //                   })
    //                 : null}
    //             </TableBody>
    //           </Table>
    //         </Paper>
    //         <Mutation mutation={ADD_TARGET}>
    //           {addTarget => (
    //             <div>
    //               <form
    //                 className={classes.form}
    //                 onSubmit={e => {
    //                   addTarget({
    //                     variables: {
    //                       name: targetName.value,
    //                       targetIp: targetIp.value
    //                     }
    //                   });
    //                   targetName.value = "";
    //                   targetIp.value = "";
    //                 }}
    //               >
    //                 <FormControl className={classes.margin} required>
    //                   <InputLabel htmlFor="targetName">
    //                     Add Target Name
    //                   </InputLabel>
    //                   <Input
    //                     id="targetName"
    //                     type="text"
    //                     name="targetName"
    //                     inputRef={node => {
    //                       targetName = node;
    //                     }}
    //                   />
    //                 </FormControl>
    //                 <FormControl className={classes.margin} required>
    //                   <InputLabel htmlFor="targetIp">Add Target IP</InputLabel>
    //                   <Input
    //                     name="targetIp"
    //                     type="text"
    //                     id="targetIp"
    //                     inputRef={node => {
    //                       targetIp = node;
    //                     }}
    //                   />
    //                 </FormControl>
    //                 <Button
    //                   type="submit"
    //                   variant="contained"
    //                   color="primary"
    //                   className={classes.submit}
    //                 >
    //                   <AddIcon className={classes.icon} />
    //                   {/* Add Target */}
    //                 </Button>
    //               </form>
    //             </div>
    //           )}
    //         </Mutation>
    //       </Fragment>
    //     );
    //   }}
    // </Query>
  );
};

export default withStyles(styles)(Objects);
