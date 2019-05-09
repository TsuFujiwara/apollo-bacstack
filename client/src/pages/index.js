import React, { Fragment } from "react";
import { Router } from "@reach/router";

import Header from "../components/Header";
import Home from "./home";
import Targets from "./targets";
import Objects from "./objects";

export default function Pages() {
  return (
    <Fragment>
      <Header />
      <Router primary={false} component={Fragment}>
        <Home path="/" />
        <Targets path="targets" />
        <Objects path="targets/:targetId" />
      </Router>
    </Fragment>
  );
}
