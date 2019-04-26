import React, { Fragment } from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const CustomTableCell = withStyles(theme => ({
  head: {
    // backgroundColor: theme.palette.common.black,
    backgroundColor: "#2196f3",
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
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
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  }
});

const GET_TARGETSANDOBJECTS = gql`
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

const ADD_TARGET = gql`
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

const DELETE_TARGET = gql`
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

// const UPDATE_TARGET = gql`
//   mutation UpdateTarget($targetId: ID!, $name: String!, $targetIp: String!) {
//     updateTarget(targetId: $targetId, name: $name, targetIp: $targetIp) {
//       success
//       message
//       targets {
//         userId
//         id
//         name
//         targetIp
//       }
//     }
//   }
// `;

const BacnetObjectsTable = ({ classes }) => {
  const [state, setState] = React.useState({
    delTargetId: 0,
    delTargetName: "",
    updateTargetId: 0,
    updateTargetName: "",
    updateTargetIp: "",
    lebelwidth: 0
  });
  // const inputLabelRef = React.useRef(null);

  const delFormChange = e => {
    e.preventDefault();
    setState({
      ...state,
      [e.target.name]: e.target.value
    });
    console.log(state);
  };

  let targetName;
  let targetIp;

  return (
    <Query query={GET_TARGETSANDOBJECTS} fetchPolicy="network-only">
      {/* GraphQLのクエリの実行結果の処理、成功したら結果を表示 */}
      {({ data, loading, error }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error</p>;
        // console.log(data.me);

        return (
          <Fragment>
            <div>
              <Paper className={classes.root}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <CustomTableCell>#</CustomTableCell>
                      <CustomTableCell align="right">
                        Target Name
                      </CustomTableCell>
                      <CustomTableCell align="right">Target IP</CustomTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.me && data.me.targets.length
                      ? data.me.targets.map((target, id) => (
                          <TableRow key={id}>
                            <CustomTableCell component="th" scope="row">
                              {id}
                            </CustomTableCell>
                            <CustomTableCell align="right">
                              {target.name}
                            </CustomTableCell>
                            <CustomTableCell align="right">
                              {target.targetIp}
                            </CustomTableCell>
                          </TableRow>
                        ))
                      : null}
                  </TableBody>
                </Table>
              </Paper>
            </div>
            <Mutation mutation={ADD_TARGET}>
              {addTarget => (
                <div>
                  <form
                    className={classes.form}
                    onSubmit={e => {
                      // e.preventDefault();
                      addTarget({
                        variables: {
                          name: targetName.value,
                          targetIp: targetIp.value
                        }
                      });
                      targetName.value = "";
                      targetIp.value = "";
                    }}
                  >
                    <FormControl className={classes.margin} required>
                      <InputLabel htmlFor="targetName">
                        Add Target Name
                      </InputLabel>
                      <Input
                        id="targetName"
                        name="targetName"
                        autoFocus
                        inputRef={node => {
                          targetName = node;
                        }}
                      />
                    </FormControl>
                    <FormControl className={classes.margin} required>
                      <InputLabel htmlFor="targetIp">Add Target IP</InputLabel>
                      <Input
                        name="targetIp"
                        type="text"
                        id="targetIp"
                        inputRef={node => {
                          targetIp = node;
                        }}
                      />
                    </FormControl>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                    >
                      Add Target
                    </Button>
                  </form>
                </div>
              )}
            </Mutation>
            <Mutation mutation={DELETE_TARGET}>
              {deleteTarget => (
                <div>
                  <form
                    className={classes.form}
                    onSubmit={e => {
                      console.log(state.delTargetId);
                      deleteTarget({
                        variables: {
                          targetId: state.delTargetId
                        }
                      });
                    }}
                    autoComplete="off"
                  >
                    <FormControl className={classes.formControl} required>
                      <InputLabel htmlFor="targetName">
                        Delete Target Name
                      </InputLabel>
                      <Select
                        value={state.delTargetId}
                        onChange={delFormChange}
                        inputProps={{
                          name: "delTargetId"
                        }}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {data.me && data.me.targets.length
                          ? data.me.targets.map((target, id) => (
                              <MenuItem key={id} value={target.id}>
                                {target.name}
                              </MenuItem>
                            ))
                          : null}
                      </Select>
                    </FormControl>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                    >
                      Delete Target
                    </Button>
                  </form>
                </div>
              )}
            </Mutation>
          </Fragment>
        );
      }}
    </Query>
  );
};

export default withStyles(styles)(BacnetObjectsTable);
