import React, { Fragment } from "react";
import { Router } from "@reach/router";

import TargetsAndObjects from "./targetsAndObjects";

export default function Pages() {
  return (
    <Fragment>
      <Router primary={false} component={Fragment}>
        <TargetsAndObjects path="/" />
      </Router>
    </Fragment>
  );
}
